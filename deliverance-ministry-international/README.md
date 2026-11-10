# L137 Deliverance Ministry — Developer README

Welcome. This document covers everything a developer needs to run, understand, and modify the L137 Deliverance Ministry website.

- **Live site:** https://l137.pplx.app
- **Stack:** Static frontend (HTML/CSS/vanilla JS) + Python FastAPI backend + SQLite database
- **Hosted on:** Perplexity's `pplx.app` platform (S3 for static assets, isolated sandbox for the backend)
- **Owner:** Pastor Kiki Ocansey, Founder of L137 Deliverance Ministry International
- **Single admin user model** — no per-user accounts; one shared admin password protects write endpoints

---

## 1. Project layout

```
l137-ministry/
├── index.html         Public homepage (hero, daily word, dominion hour, about, etc.)
├── admin.html         Password-protected admin form for posting daily readings
├── daily.js           Fetches today's reading + 14-day archive from the API
├── app.js             Small UI scripts (nav drawer, prayer modal, etc.)
├── style.css          All styles, one file, hand-written CSS (no Tailwind/SCSS)
├── server.py          FastAPI backend serving the JSON API
├── requirements.txt   Pinned Python dependencies
├── data.db            SQLite database (single `readings` table)
├── .gitignore         Excludes db files, .env, __pycache__
└── README.md          This file
```

No build step. No bundler. No framework. Static files are served straight to the browser, JavaScript runs as plain `<script>` tags, CSS is loaded as one file.

---

## 2. Local development

### Prerequisites
- Python 3.11 or 3.12
- No Node.js needed

### Install and run

```bash
cd l137-ministry
python -m venv .venv
source .venv/bin/activate         # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# REQUIRED — the server will refuse to start without this env var
export L137_ADMIN_PASSWORD='your-local-dev-password'

python server.py
```

Then in a second terminal, serve the static files (so the frontend can be loaded in a browser):

```bash
cd l137-ministry
python -m http.server 8080
```

Open http://localhost:8080 in a browser.

The frontend detects local dev via the placeholder `__PORT_8000__` in `daily.js`:

```js
var API = "__PORT_8000__".startsWith("__") ? "http://localhost:8000" : "__PORT_8000__";
```

In production, the platform rewrites `__PORT_8000__` to the proxied backend path at deploy time.

### Admin form locally
Open http://localhost:8080/admin.html and use the password you exported above.

---

## 3. The backend

`server.py` is a small FastAPI app, roughly 250 lines. It serves a single resource: **daily readings.**

### Data model

One table, `readings`:

| column        | type                       | notes |
|---------------|----------------------------|-------|
| `id`          | INTEGER PRIMARY KEY        | auto-increment |
| `reading_date`| TEXT (YYYY-MM-DD)          | NOT NULL, UNIQUE — one reading per date |
| `title`       | TEXT                       | e.g. "THE POWER OF GOD'S LOVE" |
| `ref`         | TEXT                       | e.g. "Ephesians 3:19 (KJV)" |
| `verse`       | TEXT                       | full KJV quote |
| `teaching`    | TEXT                       | multi-paragraph; `\n\n` between paragraphs |
| `prayer`      | TEXT                       | short closing prayer |
| `created_at`  | TEXT (ISO timestamp)       |  |

### API endpoints

| Method | Path                          | Auth | Returns |
|--------|-------------------------------|------|---------|
| GET    | `/api/daily`                  | none | today's reading (newest if no entry for today) |
| GET    | `/api/daily/archive?limit=14` | none | recent readings, newest first |
| GET    | `/api/daily/history`          | none | full list (used by the admin UI) |
| POST   | `/api/daily`                  | admin | create a reading |
| PATCH  | `/api/daily/{id}`             | admin | update a reading |
| DELETE | `/api/daily/{id}`             | admin | delete a reading |
| POST   | `/api/admin/verify`           | admin | password check for the admin UI |

### Auth
Admin endpoints require the header `X-Admin-Password: <value>`. The value is compared against the `L137_ADMIN_PASSWORD` environment variable using `secrets.compare_digest` (constant-time). No sessions, no cookies — every admin request must send the header.

### Example: create a reading

```bash
curl -X POST http://localhost:8000/api/daily \
  -H "Content-Type: application/json" \
  -H "X-Admin-Password: $L137_ADMIN_PASSWORD" \
  -d '{
    "title": "THE POWER OF GOD\u0027S LOVE",
    "ref": "Ephesians 3:19 (KJV)",
    "verse": "And to know the love of Christ, which passeth knowledge...",
    "teaching": "First paragraph.\n\nSecond paragraph.",
    "prayer": "I declare in the Name of Jesus Christ... Amen.",
    "reading_date": "2026-06-12"
  }'
```

Omit `reading_date` to default to today (UTC). If a reading already exists for that date, the POST returns `409 Conflict` — use PATCH to update or DELETE then re-POST.

---

## 4. The frontend

### Pages
- `index.html` — single-page homepage with anchor sections: `#daily`, `#dominion-hour`, `#about`, `#connect`, etc.
- `admin.html` — password gate, form for new readings, history table with inline edit/delete.

### How the daily reading is rendered
`daily.js`:
1. On page load, calls `GET /api/daily` and renders the title, ref, verse, teaching paragraphs, and prayer into the `.daily-card` block.
2. Formats the date label using `reading.reading_date` with a `T12:00:00` anchor (to avoid timezone-off-by-one bugs).
3. Then calls `GET /api/daily/archive?limit=14` and renders previous readings as expandable `<details>` cards under `#daily-archive`.

### Styling
All styles live in `style.css`. The design system uses CSS custom properties at the top of the file:

```css
:root {
  --c-navy: #0b1233;
  --c-cream: #f7f3e8;
  --c-gold: #eab308;
  --c-gold-soft: #d4a017;
  /* etc */
}
```

Fonts are loaded from Google Fonts — `Fraunces` (display serif) and `Inter` (UI sans).

---

## 5. Conventions & rules from the ministry

These came from the founder. Please preserve them in any changes.

1. **Always write "L137 Deliverance Ministry International" in full.** Never abbreviate to just "L137" in copy.
2. **Christian deliverance ministry only.** No content from other religions or new-age sources, no Reddit links, no horoscope-style sources.
3. **No donation / sowing / sending-money features for now.** These were intentionally removed and should not be re-added without explicit approval from Pastor Kiki.
4. **No WhatsApp link in the public UI** — it will be added back later.
5. **KJV only for scripture quotes** — use the `(KJV)` suffix in references.
6. **Pastor Kiki Ocansey is the founder.** Always credit her as such where relevant.
7. **No emojis in formal copy** (homepage, admin UI, emails).

---

## 6. Deployment notes

The site is hosted on Perplexity's `pplx.app` platform, not on a generic cloud:
- Static assets (`index.html`, `admin.html`, `*.js`, `*.css`) are uploaded to S3 and served directly.
- `server.py` runs inside an isolated sandbox; API requests go through the platform proxy at `/port/8000/...`.
- The `L137_ADMIN_PASSWORD` env var is set at deploy time via the platform's secret-injection mechanism.
- The SQLite file `data.db` lives inside the sandbox. It's snapshotted on redeploy, but for production-grade durability you would migrate to Postgres or Supabase.
- The placeholder `__PORT_8000__` in `daily.js` is rewritten by the platform during S3 upload — do not hand-edit it.

**Republishing is done from the owner's Perplexity workspace, not from this repo.** If you make changes locally and want them live, hand the updated zip back to the owner so it can be redeployed.

---

## 7. Suggested places to extend

- **Move from SQLite to Postgres/Supabase** for proper multi-instance persistence.
- **Add CSRF protection** to the admin endpoints if/when session-based auth is introduced.
- **Add tighter CORS rules** in `server.py` (currently permissive — fine for single-origin pplx.app, but worth tightening before any third-party origin is allowed).
- **Add a Watch page** for archived broadcasts (one possible future feature).
- **Image hosting** — currently no asset pipeline. If you add hero or teaching images, drop them in a new `static/img/` folder and reference them with relative paths.

---

## 8. Contact

Send all changes back to the owner as a zip or a patch. The owner will redeploy via the Perplexity workspace.

For questions about the spiritual content, voice, or any change that touches scripture text, the prayer copy, or ministry naming — please defer to Pastor Kiki Ocansey, founder of L137 Deliverance Ministry International.
