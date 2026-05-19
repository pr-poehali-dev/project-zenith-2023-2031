"""
Получает популярные свежие треки с Jamendo API для музыкального плеера.
"""
import json
import urllib.request
import urllib.parse

JAMENDO_CLIENT_ID = "b6747d04"
JAMENDO_API = "https://api.jamendo.com/v3.0/tracks/"

def handler(event: dict, context) -> dict:
    headers = {"Access-Control-Allow-Origin": "*"}

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": {**headers,
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"}, "body": ""}

    params = urllib.parse.urlencode({
        "client_id": JAMENDO_CLIENT_ID,
        "format": "json",
        "limit": 6,
        "order": "popularity_month",
        "tags": "electronic hip-hop",
        "audioformat": "mp32",
        "include": "musicinfo",
    })

    url = f"{JAMENDO_API}?{params}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode())

    tracks = []
    for t in data.get("results", []):
        duration_s = int(t.get("duration", 0))
        minutes = duration_s // 60
        seconds = duration_s % 60
        tracks.append({
            "id": t["id"],
            "title": t["name"],
            "artist": t["artist_name"],
            "src": t["audio"],
            "duration": f"{minutes}:{seconds:02d}",
            "releasedate": t.get("releasedate", ""),
        })

    return {
        "statusCode": 200,
        "headers": {**headers, "Content-Type": "application/json"},
        "body": json.dumps({"tracks": tracks}),
    }
