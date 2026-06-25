# Rio — AI-Powered Exam Marker

[![Vercel](https://img.shields.io/badge/deployed_on-Vercel-000?logo=vercel)](https://rio-marker.vercel.app)
[![Rust](https://img.shields.io/badge/built_with-Rust-dea584?logo=rust)](https://www.rust-lang.org)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Rio automates handwritten exam grading. Upload scanned answer scripts, let OCR extract the text, and get AI-suggested marks per question based on your rubric. Teachers review everything in a full-screen grading workspace and override marks where needed.

## Architecture

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│  Vercel  │────▶│  Render      │────▶│  Render      │
│ Frontend │     │ Rust Backend │     │ OCR Service  │
│ (React)  │     │ (Axum 0.8)   │     │ (FastAPI)    │
└──────────┘     └──────┬───────┘     └──────────────┘
                        │
                  ┌─────▼──────┐
                  │ PostgreSQL │
                  │ (Render)   │
                  └────────────┘
```

| Component | Stack | Hosting |
|-----------|-------|---------|
| Frontend | React, TypeScript, Tailwind v4 | [Vercel](https://rio-marker.vercel.app) |
| Backend | Rust, Axum 0.8, sqlx, JWT | Render (Docker) |
| OCR Service | Python, FastAPI, Tesseract | Render (Docker) |
| Database | PostgreSQL 16 | Render Managed DB |

## Features

- **OCR Extraction** — Upload images/PDFs, extract handwritten text per question
- **AI Auto-Marking** — Keyword, coverage, and overlap scoring against your rubric
- **Review & Override** — Full-screen grading workspace with per-question navigation
- **Analytics** — Per-question averages, difficulty index, class statistics
- **Teacher Dashboard** — Manage assessments, scripts, and student results

## Quick Start (Local Development)

### Prerequisites

- [Rust](https://rustup.rs) 1.86+
- [Node.js](https://nodejs.org) 22+
- [PostgreSQL](https://www.postgresql.org) 16+
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract)
- Python 3.13+

### Setup

```bash
# 1. Clone
git clone https://github.com/Winney360/exam-marker.git
cd exam-marker

# 2. Create a `rio` database
createdb rio

# 3. Backend env vars
cat > backend/.env << 'EOF'
DATABASE_URL=postgres://postgres:postgres@localhost:5432/rio
JWT_SECRET=dev-secret-change-in-production
OCR_SERVICE_URL=http://127.0.0.1:5001
SERVER_ADDR=127.0.0.1
SERVER_PORT=3000
UPLOAD_DIR=uploads
EOF

# 4. Backend
cd backend
cargo run

# 5. OCR service (separate terminal)
cd ocr-service
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --port 5001

# 6. Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`. The frontend proxies `/api` to the backend automatically.

## Production Deployment

### Vercel (Frontend)

| Setting | Value |
|---------|-------|
| Framework | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Env Var | `VITE_API_URL=https://exam-marker.onrender.com` |

### Render (Backend + OCR + DB)

Two Docker web services + one managed PostgreSQL:

**rio-backend** (Docker):
| Key | Value |
|-----|-------|
| Dockerfile Path | `./Dockerfile` |
| Health Check | `/health` |
| `DATABASE_URL` | *(from rio-db)* |
| `JWT_SECRET` | *(generate a random string)* |
| `OCR_SERVICE_URL` | `http://rio-ocr:5001` |
| `SERVER_ADDR` | `0.0.0.0` |
| `SERVER_PORT` | `3000` |
| `UPLOAD_DIR` | `/data/uploads` |

**rio-ocr** (Docker):
| Key | Value |
|-----|-------|
| Root Directory | `ocr-service` |
| Dockerfile Path | `./Dockerfile` |
| `PORT` | `5001` |

**rio-db**: Managed PostgreSQL, free tier.

## API Overview

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Create teacher account |
| POST | `/auth/login` | Get JWT token |
| GET/POST | `/assessments` | List / Create assessments |
| GET | `/assessments/:id` | Assessment details |
| GET/POST | `/assessments/:id/questions` | List / Add questions |
| PUT/DELETE | `/assessments/:id/questions/:qid` | Update / Delete question |
| GET/POST | `/assessments/:id/scripts` | List / Upload scripts |
| POST | `/scripts/:id/process` | Run OCR |
| POST | `/scripts/:id/mark` | Run AI marking |
| GET | `/scripts/:id/marks` | Get all marks |
| GET | `/scripts/:id/answers` | Get extracted answers |
| PUT | `/marks/:id` | Override a mark |
| DELETE | `/scripts/:id` | Delete script |
| GET | `/assessments/:id/analytics` | Class analytics |

All routes except auth require `Authorization: Bearer <token>`.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Tailwind CSS v4, Vite |
| Backend | Rust, Axum 0.8, sqlx, jsonwebtoken, tower-http |
| OCR | Python, FastAPI, pytesseract, OpenCV, pdf2image |
| Database | PostgreSQL 16 |
| Auth | JWT (bcrypt passwords) |

## License

MIT
