import json
import os
import psycopg2

SCHEMA = "t_p31046477_project_zenith_2023_"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
}

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def get_user_id(token: str) -> int | None:
    if not token or ":" not in token:
        return None
    try:
        return int(token.split(":")[0])
    except Exception:
        return None

def handler(event: dict, context) -> dict:
    """Чат пользователей — отправка и получение сообщений"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    params = event.get("queryStringParameters") or {}
    action = params.get("action", "")
    headers = event.get("headers") or {}
    token = headers.get("X-Session-Token", "")
    body = json.loads(event.get("body") or "{}")

    conn = get_conn()
    cur = conn.cursor()

    try:
        if action == "send":
            user_id = get_user_id(token)
            if not user_id:
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Войдите в аккаунт"})}

            text = (body.get("text") or "").strip()
            if not text:
                return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Сообщение пустое"})}

            cur.execute(
                f"INSERT INTO {SCHEMA}.chat_messages (user_id, text, is_admin) VALUES ({user_id}, $msg${text}$msg$, false) RETURNING id, text, is_admin, created_at"
            )
            row = cur.fetchone()
            conn.commit()

            return {
                "statusCode": 200,
                "headers": CORS,
                "body": json.dumps({
                    "message": {"id": row[0], "text": row[1], "is_admin": row[2], "created_at": str(row[3])}
                })
            }

        elif action == "history":
            user_id = get_user_id(token)
            if not user_id:
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Войдите в аккаунт"})}

            cur.execute(
                f"SELECT id, text, is_admin, created_at FROM {SCHEMA}.chat_messages WHERE user_id = {user_id} ORDER BY created_at ASC LIMIT 100"
            )
            rows = cur.fetchall()
            messages = [{"id": r[0], "text": r[1], "is_admin": r[2], "created_at": str(r[3])} for r in rows]
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"messages": messages})}

        elif action == "admin_list":
            admin_token = headers.get("X-Admin-Token", "")
            if admin_token != os.environ.get("ADMIN_CHAT_TOKEN", "carnival2025"):
                return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Нет доступа"})}

            cur.execute(
                f"""SELECT u.id, u.username, u.email,
                    COUNT(m.id) as msg_count,
                    MAX(m.created_at) as last_message,
                    SUM(CASE WHEN m.is_admin = false THEN 1 ELSE 0 END) as unread
                    FROM {SCHEMA}.users u
                    LEFT JOIN {SCHEMA}.chat_messages m ON m.user_id = u.id
                    GROUP BY u.id, u.username, u.email
                    ORDER BY last_message DESC NULLS LAST"""
            )
            rows = cur.fetchall()
            users = [{"id": r[0], "username": r[1], "email": r[2], "msg_count": r[3], "last_message": str(r[4]) if r[4] else None, "unread": r[5] or 0} for r in rows]
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"users": users})}

        elif action == "admin_history":
            admin_token = headers.get("X-Admin-Token", "")
            if admin_token != os.environ.get("ADMIN_CHAT_TOKEN", "carnival2025"):
                return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Нет доступа"})}

            user_id = params.get("user_id")
            if not user_id:
                return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "user_id обязателен"})}

            cur.execute(
                f"SELECT id, text, is_admin, created_at FROM {SCHEMA}.chat_messages WHERE user_id = {user_id} ORDER BY created_at ASC LIMIT 200"
            )
            rows = cur.fetchall()
            messages = [{"id": r[0], "text": r[1], "is_admin": r[2], "created_at": str(r[3])} for r in rows]
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"messages": messages})}

        elif action == "admin_reply":
            admin_token = headers.get("X-Admin-Token", "")
            if admin_token != os.environ.get("ADMIN_CHAT_TOKEN", "carnival2025"):
                return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Нет доступа"})}

            user_id = body.get("user_id")
            text = (body.get("text") or "").strip()
            if not user_id or not text:
                return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "user_id и text обязательны"})}

            cur.execute(
                f"INSERT INTO {SCHEMA}.chat_messages (user_id, text, is_admin) VALUES ({user_id}, $msg${text}$msg$, true) RETURNING id, text, is_admin, created_at"
            )
            row = cur.fetchone()
            conn.commit()

            return {
                "statusCode": 200,
                "headers": CORS,
                "body": json.dumps({"message": {"id": row[0], "text": row[1], "is_admin": row[2], "created_at": str(row[3])}})
            }

        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Неизвестное действие"})}

    finally:
        cur.close()
        conn.close()
