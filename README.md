# Chethan J D — Portfolio

Personal portfolio website: a Netflix-style browsing experience for projects, experience, skills, education, and certifications.

- **Entry**: profile gate (`index.html`) — pick Recruiter or Visitor to personalize the visit.
- **Hub** (`browse.html`): hero with a per-profile background video (recruiter → `bg-1.mp4`, visitor → `bg-2.mp4`), project showcase cards with live-demo/GitHub links, experience, skills, education, certifications (NPTEL, Virtual Experience, Internship Experience, Online Courses), and contact links.
- **About** (`about.html`): bio, focus areas, and a keyboard-accessible image lightbox.
- **Demo** (`demos/wifivision/`): interactive Wi-Fi presence-sensing canvas simulation.
- **API demo** (`api/body-metrics/`): minimal FastAPI service (passwordless OTP → bearer sessions → metric entries, SQLite).
- **PWA**: web manifest + service worker (offline cache for pages/styles; media always streams from network).

## Technologies

- Static **HTML / CSS / vanilla JavaScript** — no frontend framework, no build step.
- **Node.js** (tests + dev server only): Vitest 3 + jsdom static checks; `serve` for local preview.
- **Python** (optional API demo): FastAPI, uvicorn, pydantic.
- Hosting configs included: **Caddy + Docker**, **Netlify**, **Railway**.

## Project structure

```
index.html browse.html about.html        # pages
css/ tokens.css base.css gate.css project.css fonts.css (blog.css is an unused leftover)
js/ nav.js profile.js gallery.js         # shared nav, profile, lightbox helpers
projects/                                # empty; cards link directly to live demos
demos/wifivision/index.html              # canvas demo
api/body-metrics/ main.py requirements.txt
assets/                                  # images, videos, resume, intro sound, certificate PDFs
icons/ manifest.webmanifest sw.js        # PWA
automation/add-project.mjs               # project-page scaffolding helper
tests/ vitest.config.ts package.json
Caddyfile Dockerfile netlify.toml railway.json
```

## Prerequisites

- Node.js 18+ (`node --version`)
- Python 3.11+ only for the optional API demo

## Installation

```bash
npm install
```

## Local development

```bash
npm run dev      # serves the site at http://localhost:3000
npm test         # runs the vitest static checks
```

## Production build

There is no build step — the site is static. Deploy the repository directory as-is.

## Deployment

- **Netlify**: publish directory `.` (see `netlify.toml`).
- **Railway / Docker**: uses `Dockerfile` + Caddy (see `Caddyfile`, healthcheck `/`).
- **Any static host**: upload the folder contents. Note: the service worker requires HTTPS (or localhost) to activate.

## Assets and certificates

- Thumbnails, profile photo, resume (`assets/resume.pdf`), and intro sound live in `assets/`.
- Background videos: `assets/videos/bg-1.mp4` (recruiter), `assets/videos/bg-2.mp4` (visitor).
- Certificate **View Certificate** buttons point at these PDFs in `assets/`:
  `jpmorgan-software-engineering-simulation.pdf`,
  `codtech-vlsi-internship.pdf`,
  `isro-ai-ml-geodata-analytics.pdf`,
  `scaler-python-beginners.pdf`,
  `datacamp-working-with-openai-api.pdf`,
  `datacamp-prompt-engineering-openai-api.pdf`,
  `mathworks-simulink-onramp.pdf`,
  `mathworks-matlab-onramp.pdf`
- ⚠️ **These 8 PDFs are not in the repository yet** — the buttons will 404 until the files are added under those exact names.

## Security and privacy

- No secrets are committed (verified by scan). Copy `.env.example` to `.env` for local-only settings; `.env` is git-ignored.
- The demo API returns a development OTP only when SMTP is unconfigured — configure real `SMTP_*` vars before any public deployment, and do not deploy the demo API without them.
- Contact is via `mailto:` plus public LinkedIn/GitHub profile links; no phone number is published.

## Known large assets

- `assets/videos/bg-2.mp4` (~57 MB) keeps the checkout around ~85 MB total — fine for GitHub's 100 MB per-file limit, but consider Git LFS if the repo grows further.

## Future improvements

- Add the 8 missing certificate PDFs (see list above).
- Compress `bg-2.mp4` or serve it in a more efficient codec.
- Replace remaining remote profile/persona images with local assets.

## License

No license has been chosen — all rights reserved by default. Add a `LICENSE` file if you want to open-source this project.
