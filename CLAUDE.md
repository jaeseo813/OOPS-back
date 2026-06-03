# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OOPS — a university community web application (commute/student life bulletin board). Full-stack monorepo with a React frontend (`Team_Project/`) and a FastAPI backend (`backend/`).

## Development Commands

### Frontend (Team_Project/)
```bash
cd Team_Project
npm install
npm run dev          # Vite dev server on :5173
npm run build        # Production build
npm run lint         # ESLint
```

### Backend (backend/)
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000   # Dev server
```

Backend requires a `.env` file in `backend/` with `SECRET_KEY` and `DATABASE_URL` (SQLite default: `sqlite:///./test.db`).

## Architecture

### Frontend → Backend Communication

Vite dev proxy forwards `/api/*` to `http://127.0.0.1:8000` (stripping the `/api` prefix). The API client (`src/api/client.js`) prepends `VITE_API_BASE_URL` (=`/api`) to all requests.

### Mock Mode

Setting `VITE_USE_MOCK_DATA=true` in `.env.development` makes `App.jsx` use inline mock data (posts, users, comments) instead of calling the backend. This allows UI development without running the server.

### State Management

No external state library. All state lives in `App.jsx` via `useReducer` + React Context:

- **Posts**: `PostDataContext` / `PostDispatchContext`
- **Users**: `UserDataContext` / `UserDispatchContext`
- **Comments**: `CommentDataContext` / `CommentDispatchContext`
- **Login state**: `LoginStateContext`

Contexts are defined in `src/util/context.jsx`. Every dispatch action (CREATE, DELETE, UPDATE, SET, UPSERT) has a counterpart in `App.jsx` that calls the API when not in mock mode, then dispatches locally.

### API Layer (`src/api/`)

All backend calls go through `client.js` (`apiRequest`). It handles JSON serialization, Bearer token auth, and error normalization into `ApiError`. Field mapping between backend snake_case and frontend camelCase is centralized in `mappers.js`. Auth token is stored in localStorage via `authStorage.js`.

### Routing (react-router-dom v7)

Defined in `App.jsx` with `BrowserRouter` in `main.jsx`:

| Path | Component | Notes |
|---|---|---|
| `/` | Main | Home page |
| `/popular` | HotPostWidget | Popular posts |
| `/free` | FreePostWidget | Free board |
| `/notice` | NoticePostWidget | Notice board |
| `/write` | PostWrite | New post |
| `/detail/:postId` | PostDetail | Post detail |
| `/auth` | AuthCenter | Login/Signup |
| `/search/:searchId` | SearchPage | Search results |
| `/mypage/:userId` | MyPage | User profile |
| `/edit/:type/:postId` | Edit | Edit post or comment |

### Backend Structure

FastAPI app in `backend/app/`:

- `api/` — Route handlers (auth, users, posts, comments)
- `services/` — Business logic
- `models/` — SQLAlchemy models
- `schemas/` — Pydantic request/response schemas
- `core/` — Config (`pydantic-settings`), security (JWT via `python-jose`)
- `db/` — SQLAlchemy engine/session setup
- `deps.py` — FastAPI dependencies (DB session, current user)

### Key Conventions

- Post categories: `free` and `notification` on frontend; mapped to `free` and `notice` on backend via `mappers.js`
- Auth flow: JWT tokens stored in localStorage under `currentLoginUser` key, attached as `Authorization: Bearer <token>`
- Each component has a co-located `.css` file for styling (no CSS-in-JS or Tailwind)
- ESLint has `no-unused-vars: off` and no prop-types enforcement
