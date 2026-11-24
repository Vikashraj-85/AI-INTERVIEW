# AI-INTERVIEWW setup

## Backend (Windows PowerShell)
```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
python manage.py migrate
python manage.py runserver
```
Put your API key in `backend/.env` as `XAI_API_KEY=...`. Django loads this file automatically. Alternatively, set the key in your shell for this terminal session:
```powershell
$env:XAI_API_KEY="YOUR_KEY"
$env:AI_BASE_URL="https://api.x.ai/v1"
$env:AI_MODEL="grok-3-mini"
python manage.py runserver
```
Never put your API key in React/Vite code or upload it publicly. If no key is present, interview questions use a built-in question bank and resume review uses local text/keyword checks. AI evaluation is used only when the key and provider are available.

## Frontend (new terminal)
```powershell
cd frontend
npm install
npm run dev
```
Open the URL Vite prints (usually `http://localhost:5173`). The frontend API points to `http://127.0.0.1:8000/api/`.

## Features
- JWT registration/login and profile updates
- Dashboard stats from saved sessions
- Create role/type/difficulty-specific mock interview sessions
- Save answers and receive feedback; AI evaluation when configured, otherwise a clearly labeled answer-completeness estimate
- Upload PDF resumes (maximum 10 MB), local PDF text extraction, resume analysis, and resume-linked interview setup
- Interview history and performance page

Scanned/image-only PDFs need OCR and currently return a helpful message. Scores without an AI provider are heuristic and must not be treated as an expert evaluation.
