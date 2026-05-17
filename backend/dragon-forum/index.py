import json
import os
import pg8000.native
from urllib.parse import urlparse, unquote

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

def get_conn():
    p = urlparse(os.environ["DATABASE_URL"])
    return pg8000.native.Connection(
        user=unquote(p.username),
        password=unquote(p.password),
        host=p.hostname,
        port=p.port or 5432,
        database=p.path.lstrip("/"),
    )

def esc(val):
    """Экранирование строки для Simple Query Protocol."""
    return "'" + str(val).replace("'", "''") + "'"

def row_to_dict(row, cols):
    d = {}
    for i, c in enumerate(cols):
        v = row[i]
        d[c] = v.isoformat() if hasattr(v, "isoformat") else v
    return d

def handler(event: dict, context) -> dict:
    """API форума Carnival Dragon — вопросы и заявки."""

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    kind = params.get("kind", "questions")
    action = params.get("action", "list")

    table = "dragon_questions" if kind == "questions" else "dragon_requests"

    conn = get_conn()

    # GET — список записей
    if method == "GET" and action == "list":
        rows = conn.run(
            f"SELECT id, author, avatar, text, answer, answered, "
            f"to_char(created_at, 'DD Mon YYYY') as date "
            f"FROM {table} ORDER BY created_at DESC LIMIT 50"
        )
        cols = [c["name"] for c in conn.columns]
        result = [row_to_dict(r, cols) for r in rows]
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps(result, ensure_ascii=False)}

    body = json.loads(event.get("body") or "{}")

    # POST — создать вопрос/заявку
    if method == "POST" and action == "create":
        author = (body.get("author") or "").strip()[:100]
        text = (body.get("text") or "").strip()
        if not author or not text:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "author and text required"})}

        initials = "".join(w[0].upper() for w in author.split() if w)[:2]

        if kind == "requests":
            cnt_rows = conn.run(f"SELECT COUNT(*) FROM {table}")
            cnt = cnt_rows[0][0]
            text = f"Заявка #{str(cnt + 1).zfill(3)} — {text}"

        sql = (
            f"INSERT INTO {table} (author, avatar, text) "
            f"VALUES ({esc(author)}, {esc(initials)}, {esc(text)}) "
            f"RETURNING id, author, avatar, text, answer, answered, "
            f"to_char(created_at, 'DD Mon YYYY') as date"
        )
        rows = conn.run(sql)
        cols = [c["name"] for c in conn.columns]
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps(row_to_dict(rows[0], cols), ensure_ascii=False)}

    # PUT — добавить ответ
    if method == "PUT" and action == "answer":
        record_id = body.get("id")
        answer = (body.get("answer") or "").strip()
        if not record_id or not answer:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "id and answer required"})}

        sql = (
            f"UPDATE {table} SET answer={esc(answer)}, answered=TRUE "
            f"WHERE id={int(record_id)} "
            f"RETURNING id, author, avatar, text, answer, answered, "
            f"to_char(created_at, 'DD Mon YYYY') as date"
        )
        rows = conn.run(sql)
        cols = [c["name"] for c in conn.columns]
        conn.close()
        if not rows:
            return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "not found"})}
        return {"statusCode": 200, "headers": CORS, "body": json.dumps(row_to_dict(rows[0], cols), ensure_ascii=False)}

    conn.close()
    return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "unknown action"})}
