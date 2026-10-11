# Chethan J D — Portfolio

Personal portfolio: profile-gated entry → Netflix-style hub → about + lightbox →
project pages → interactive canvas demo → minimal FastAPI service → PWA + deploy.

## Quick start

```bash
npm install
npx serve .                # or: python3 -m http.server 8080
npm test                   # vitest static checks
```

## Structure

```
index.html browse.html about.html
css/ tokens.css base.css gate.css project.css fonts.css
js/ nav.js profile.js gallery.js
projects/ (removed — cards link directly to live demos)
demos/wifivision/index.html
api/body-metrics/ main.py requirements.txt
automation/add-project.mjs
tests/ sw.js manifest.webmanifest Caddyfile Dockerfile netlify.toml railway.json
```

## API demo

```bash
pip install -r api/body-metrics/requirements.txt
uvicorn main:app --port 8000 --app-dir api/body-metrics
# POST /api/auth/request-otp {"email":"you@example.com"} → dev_otp (no SMTP)
# POST /api/auth/verify-otp → {token} → Bearer token for /api/entries
```

Configure real delivery via `.env.example` vars (SMTP_*). Never commit `.env`.

## Deploy

- Docker/Caddy: `docker build -t portfolio .` (serves `/srv`, pretty URLs)
- Netlify: publish `.` (see `netlify.toml`)
- Railway: uses `Dockerfile` + healthcheck `/`
