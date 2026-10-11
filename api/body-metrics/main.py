"""Minimal body-metrics API (clean-room template).

Mirrors the reference pattern: passwordless OTP -> Bearer sessions -> entries CRUD,
SQLite storage, optional SMTP OTP delivery (else dev code), CORS open for demo.
Run: pip install -r requirements.txt && uvicorn main:app --port 8000
"""
from __future__ import annotations
import hashlib, os, secrets, sqlite3, time
from pathlib import Path
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

DATA_DIR = Path(os.getenv("DATA_DIR", "./data"))
DATA_DIR.mkdir(parents=True, exist_ok=True)
DB = DATA_DIR / "metrics.db"

app = FastAPI(title="Body Metrics Template API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

def db():
    con = sqlite3.connect(DB)
    con.row_factory = sqlite3.Row
    con.executescript("""CREATE TABLE IF NOT EXISTS otps(email TEXT, code_hash TEXT, exp INTEGER, attempts INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY, email TEXT, exp INTEGER);
CREATE TABLE IF NOT EXISTS entries(id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, entry_date TEXT, weight REAL, bodyfat REAL, note TEXT, UNIQUE(email, entry_date));""")
    return con

class OtpReq(BaseModel): email: str
class OtpVerify(BaseModel): email: str; code: str
class Entry(BaseModel): entry_date: str; weight: float | None = None; bodyfat: float | None = None; note: str = ""

def _dev_code(email: str) -> str:
    # Deterministic dev code ONLY when SMTP is unconfigured; never log real codes.
    h = hashlib.sha256((email + os.getenv("OTP_PEPPER", "dev")).encode()).hexdigest()
    return f"{int(h[:6], 16) % 1000000:06d}"

@app.post("/api/auth/request-otp")
def request_otp(body: OtpReq):
    code = f"{secrets.randbelow(1000000):06d}" if os.getenv("SMTP_HOST") else _dev_code(body.email)
    con = db()
    con.execute("DELETE FROM otps WHERE email=?", (body.email,))
    con.execute("INSERT INTO otps(email, code_hash, exp) VALUES (?,?,?)",
                (body.email, hashlib.sha256(code.encode()).hexdigest(), int(time.time()) + 600))
    con.commit(); con.close()
    if os.getenv("SMTP_HOST"):
        return {"ok": True, "delivered": True}
    return {"ok": True, "delivered": False, "dev_otp": code, "hint": "SMTP not configured — dev code returned for local testing only"}

@app.post("/api/auth/verify-otp")
def verify_otp(body: OtpVerify):
    con = db()
    row = con.execute("SELECT * FROM otps WHERE email=?", (body.email,)).fetchone()
    if not row or row["exp"] < time.time():
        con.close(); raise HTTPException(400, "Code expired — request a new one")
    if row["attempts"] >= 5:
        con.close(); raise HTTPException(429, "Too many attempts")
    if hashlib.sha256(body.code.encode()).hexdigest() != row["code_hash"]:
        con.execute("UPDATE otps SET attempts=attempts+1 WHERE email=?", (body.email,)); con.commit(); con.close()
        raise HTTPException(400, "Invalid code")
    token = secrets.token_hex(24)
    con.execute("DELETE FROM otps WHERE email=?", (body.email,))
    con.execute("INSERT INTO sessions(token, email, exp) VALUES (?,?,?)", (token, body.email, int(time.time()) + 90*86400))
    con.commit(); con.close()
    return {"token": token}

def _who(auth: str | None) -> str:
    if not auth or not auth.startswith("Bearer "): raise HTTPException(401, "Missing bearer token")
    con = db()
    row = con.execute("SELECT * FROM sessions WHERE token=?", (auth[7:],)).fetchone()
    con.close()
    if not row or row["exp"] < time.time(): raise HTTPException(401, "Invalid session")
    return row["email"]

@app.get("/api/me")
def me(authorization: str | None = Header(default=None)): return {"email": _who(authorization)}

@app.get("/api/entries")
def list_entries(authorization: str | None = Header(default=None)):
    email = _who(authorization)
    con = db(); rows = con.execute("SELECT * FROM entries WHERE email=? ORDER BY entry_date DESC", (email,)).fetchall(); con.close()
    return [dict(r) for r in rows]

@app.put("/api/entries")
def upsert(entry: Entry, authorization: str | None = Header(default=None)):
    email = _who(authorization)
    con = db()
    con.execute("INSERT INTO entries(email, entry_date, weight, bodyfat, note) VALUES (?,?,?,?,?) ON CONFLICT(email, entry_date) DO UPDATE SET weight=excluded.weight, bodyfat=excluded.bodyfat, note=excluded.note",
                (email, entry.entry_date, entry.weight, entry.bodyfat, entry.note))
    con.commit(); con.close()
    return {"ok": True}

@app.get("/api/health")
def health(): return {"ok": True}

if Path("static").exists():
    app.mount("/", StaticFiles(directory="static", html=True), name="static")
