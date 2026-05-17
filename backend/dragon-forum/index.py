import json
import os
import pg8000.native
from urllib.parse import urlparse, unquote

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
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
    return "'" + str(val).replace("'", "''") + "'"

def row_to_dict(row, cols):
    d = {}
    for i, c in enumerate(cols):
        v = row[i]
        d[c] = v.isoformat() if hasattr(v, "isoformat") else v
    return d

def handler(event: dict, context) -> dict:
    """API форума Carnival Dragon — вопросы, заявки, участники и роли."""

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    kind = params.get("kind", "questions")
    action = params.get("action", "list")

    conn = get_conn()

    # ── MEMBERS (kind=members) ──────────────────────────────────────────────
    if kind == "members":

        # GET list
        if method == "GET" and action == "list":
            rows = conn.run(
                "SELECT id, name, vk_link, tg_link, role, is_moderator, note, "
                "to_char(created_at, 'DD Mon YYYY') as date "
                "FROM dragon_members ORDER BY is_moderator DESC, created_at DESC"
            )
            cols = [c["name"] for c in conn.columns]
            conn.close()
            return {"statusCode": 200, "headers": CORS,
                    "body": json.dumps([row_to_dict(r, cols) for r in rows], ensure_ascii=False)}

        body = json.loads(event.get("body") or "{}")

        # POST create
        if method == "POST" and action == "create":
            name = (body.get("name") or "").strip()[:100]
            if not name:
                conn.close()
                return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "name required"})}
            role = (body.get("role") or "Участник").strip()[:100]
            vk = (body.get("vk_link") or "").strip()[:200]
            tg = (body.get("tg_link") or "").strip()[:200]
            note = (body.get("note") or "").strip()
            is_mod = "TRUE" if body.get("is_moderator") else "FALSE"
            sql = (
                f"INSERT INTO dragon_members (name, vk_link, tg_link, role, is_moderator, note) "
                f"VALUES ({esc(name)}, {esc(vk)}, {esc(tg)}, {esc(role)}, {is_mod}, {esc(note)}) "
                f"RETURNING id, name, vk_link, tg_link, role, is_moderator, note, "
                f"to_char(created_at, 'DD Mon YYYY') as date"
            )
            rows = conn.run(sql)
            cols = [c["name"] for c in conn.columns]
            conn.close()
            return {"statusCode": 200, "headers": CORS,
                    "body": json.dumps(row_to_dict(rows[0], cols), ensure_ascii=False)}

        # PUT update (role / moderator flag)
        if method == "PUT" and action == "update":
            member_id = int(body.get("id", 0))
            if not member_id:
                conn.close()
                return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "id required"})}
            role = (body.get("role") or "Участник").strip()[:100]
            vk = (body.get("vk_link") or "").strip()[:200]
            tg = (body.get("tg_link") or "").strip()[:200]
            note = (body.get("note") or "").strip()
            is_mod = "TRUE" if body.get("is_moderator") else "FALSE"
            sql = (
                f"UPDATE dragon_members SET role={esc(role)}, vk_link={esc(vk)}, tg_link={esc(tg)}, "
                f"note={esc(note)}, is_moderator={is_mod} "
                f"WHERE id={member_id} "
                f"RETURNING id, name, vk_link, tg_link, role, is_moderator, note, "
                f"to_char(created_at, 'DD Mon YYYY') as date"
            )
            rows = conn.run(sql)
            cols = [c["name"] for c in conn.columns]
            conn.close()
            if not rows:
                return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "not found"})}
            return {"statusCode": 200, "headers": CORS,
                    "body": json.dumps(row_to_dict(rows[0], cols), ensure_ascii=False)}

        # DELETE remove
        if method == "DELETE" and action == "delete":
            body = json.loads(event.get("body") or "{}")
            member_id = int(body.get("id", 0))
            if not member_id:
                conn.close()
                return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "id required"})}
            conn.run(f"DELETE FROM dragon_members WHERE id={member_id}")
            conn.close()
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

        conn.close()
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "unknown members action"})}

    # ── QUESTIONS / REQUESTS ────────────────────────────────────────────────
    table = "dragon_questions" if kind == "questions" else "dragon_requests"

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

    if method == "POST" and action == "create":
        author = (body.get("author") or "").strip()[:100]
        text = (body.get("text") or "").strip()
        if not author or not text:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "author and text required"})}
        initials = "".join(w[0].upper() for w in author.split() if w)[:2]
        if kind == "requests":
            cnt = conn.run(f"SELECT COUNT(*) FROM {table}")[0][0]
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
        return {"statusCode": 200, "headers": CORS,
                "body": json.dumps(row_to_dict(rows[0], cols), ensure_ascii=False)}

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
        return {"statusCode": 200, "headers": CORS,
                "body": json.dumps(row_to_dict(rows[0], cols), ensure_ascii=False)}

    conn.close()
    return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "unknown action"})}
