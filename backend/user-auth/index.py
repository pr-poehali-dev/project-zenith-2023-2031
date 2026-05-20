import json
import os
import hashlib
import secrets
import psycopg2

SCHEMA = "t_p31046477_project_zenith_2023_"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
}

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: dict, context) -> dict:
    """Регистрация и вход пользователей Carnival Pantera"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    action = event.get("queryStringParameters", {}) or {}
    action = action.get("action", "")
    body = json.loads(event.get("body") or "{}")

    conn = get_conn()
    cur = conn.cursor()

    try:
        if action == "register":
            username = (body.get("username") or "").strip()
            email = (body.get("email") or "").strip().lower()
            password = body.get("password") or ""

            if not username or not email or not password:
                return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Заполните все поля"})}
            if len(password) < 6:
                return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Пароль минимум 6 символов"})}

            cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = '{email}' OR username = '{username}'")
            if cur.fetchone():
                return {"statusCode": 409, "headers": CORS, "body": json.dumps({"error": "Пользователь уже существует"})}

            pw_hash = hash_password(password)
            token = secrets.token_hex(32)
            cur.execute(
                f"INSERT INTO {SCHEMA}.users (username, email, password_hash) VALUES ('{username}', '{email}', '{pw_hash}') RETURNING id, username, email, created_at"
            )
            row = cur.fetchone()
            conn.commit()

            return {
                "statusCode": 200,
                "headers": CORS,
                "body": json.dumps({
                    "user": {"id": row[0], "username": row[1], "email": row[2]},
                    "token": f"{row[0]}:{token}"
                })
            }

        elif action == "login":
            email = (body.get("email") or "").strip().lower()
            password = body.get("password") or ""
            pw_hash = hash_password(password)

            cur.execute(f"SELECT id, username, email FROM {SCHEMA}.users WHERE email = '{email}' AND password_hash = '{pw_hash}'")
            row = cur.fetchone()
            if not row:
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Неверный email или пароль"})}

            token = secrets.token_hex(32)
            return {
                "statusCode": 200,
                "headers": CORS,
                "body": json.dumps({
                    "user": {"id": row[0], "username": row[1], "email": row[2]},
                    "token": f"{row[0]}:{token}"
                })
            }

        elif action == "me":
            token = (event.get("headers") or {}).get("X-Session-Token", "")
            if not token or ":" not in token:
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}
            user_id = token.split(":")[0]
            cur.execute(f"SELECT id, username, email FROM {SCHEMA}.users WHERE id = {user_id}")
            row = cur.fetchone()
            if not row:
                return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Пользователь не найден"})}
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"user": {"id": row[0], "username": row[1], "email": row[2]}})}

        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Неизвестное действие"})}

    finally:
        cur.close()
        conn.close()
