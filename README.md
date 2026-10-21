# Full Stack Task Management System

This is a Full Stack Task Management System built as part of the technical assessment. It closely follows the provided Figma design.

## Architecture

* **Frontend:** Next.js (App Router), Tailwind CSS, Lucide Icons, Custom React Context for State Management.
* **Backend:** NestJS REST API.
* **Database:** PostgreSQL with Prisma ORM.

## Live Demo

**Status: not live yet — blocked on a hosting-plan limit, not on the code.** Both halves are packaged and verified (production builds pass; every API flow was exercised against PostgreSQL in the debug cycle):

* Frontend: https://task-management.antideploy.app (Antideploy app created)
* API: https://task-management-api.antideploy.app (Antideploy app created, PostgreSQL provisioned, connection string injected by the platform as `DATABASE_URL`)

The Antideploy free plan allows **one** live server app per account, and that slot is currently taken by the Lead Management Platform. Putting this app live needs an owner decision (free the slot or upgrade the plan); the deploy itself is then a re-run with no code changes — backend from `backend/` with `FRONTEND_URL` + `NODE_ENV` as deploy env, frontend from `frontend/` with `NEXT_PUBLIC_API_URL` pointing at the API URL above. The frontend's built-in production fallback now uses the Antideploy API URL (it previously pointed at the dead Render backend).

The older Render deployment (`render.yaml`, still accurate) is dead for a platform reason: its free PostgreSQL passed Render's 30-day free-database expiry, so the backend's start command (`prisma db push && …`) can never finish booting. A fresh free database in the Render dashboard revives it.

Honest limits: the database starts empty — run `npx prisma db seed` in `backend/` for demo data (2 users, 1 project, 1 task), or just sign up / use guest login; auth is a simple user-object flow (no JWT yet, see Future Improvements).

## Setup Instructions

### 1. Start the Backend

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set `DATABASE_URL` in `backend/.env` (see `backend/.env.example`), then generate the Prisma client, create the tables, and seed the database:
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```
4. Start the backend development server:
   ```bash
   npm run start:dev
   ```
   The backend API will run on `http://localhost:3001`.

### 2. Start the Frontend

1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`.

## Features Implemented

* **Design Fidelity:** The UI accurately mirrors the provided Figma design, including layout, typography, colors, padding, and subtle interactions.
* **Theming System:** Fully custom theme system switching seamlessly between Dark and Light mode.
* **Data Flow:** React Context (`store.tsx`) handles optimistic UI updates on the frontend while synchronously writing changes to the NestJS Backend (`api.ts`).
* **Database Sync:** Prisma handles database relations cleanly with PostgreSQL. Wait for the initial load, and you'll see seeded data pulled from the database dynamically!

## Tech Stack Overview
* Next.js App Router
* TailwindCSS
* NestJS
* Prisma + PostgreSQL
* TypeScript

## Future Improvements
* Set up a proper Mono-repo (e.g. using TurboRepo or Nx) for shared typing between frontend and backend.
* Add full JWT-based authentication using Passport.js for NestJS (currently uses a simulated guest login mechanism on the frontend to match the UI).
* Use Server Actions + React Server Components in Next.js to fetch data instead of Client-Side fetching via `useEffect`.

## Part 2 – Product Understanding & UX Analysis

The product analysis and UX review of the AbleSpace **Take Data** workflow (from the Caseload view) is available here:
- 📄 **[AbleSpace_Product_Review.pdf](./AbleSpace_Product_Review.pdf)** (or view online on [Google Docs](https://docs.google.com/document/d/1-nOQYxySZ-u5zPTQOUH2pJRUSdvq_pHWecZuiaPppVs/edit))

### Summary of Sections:
1. **Workflow Breakdown:** Step-by-step walkthrough covering Caseload management, student profile navigation, IEP goal selection, live metric logging, and longitudinal progress tracking.
2. **UX/UI & Functional Improvement Proposals:**
   - **Quick-Log & Keyboard Shortcuts:** Reducing click depth with single-click logging and keyboard input options for rapid classroom data collection.
   - **Group Session Mode:** Simultaneous multi-student trial recording for group therapy sessions.
   - **Visual Contrast & Accessibility (WCAG AA):** Enhancing contrast and hierarchy for classroom lighting and mobile tablet screens.
   - **Micro-Animations & Audio/Haptic Feedback:** Clear save confirmations to eliminate user hesitation.
   - **Offline Mode & Auto-Sync:** Local client caching to safeguard data during spotty school Wi-Fi connectivity.
