# Full Stack Task Management System

This is a Full Stack Task Management System built as part of the technical assessment. It closely follows the provided Figma design.

## Architecture

* **Frontend:** Next.js (App Router), Tailwind CSS, Lucide Icons, Custom React Context for State Management.
* **Backend:** NestJS REST API.
* **Database:** SQLite with Prisma ORM.

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
3. Generate the Prisma client and seed the database:
   ```bash
   npx prisma generate
   npx ts-node prisma/seed.ts
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
* **Database Sync:** Prisma handles database relations cleanly with SQLite. Wait for the initial load, and you'll see seeded data pulled from the database dynamically!

## Tech Stack Overview
* Next.js App Router
* TailwindCSS
* NestJS
* Prisma + SQLite
* TypeScript

## Future Improvements
* Set up a proper Mono-repo (e.g. using TurboRepo or Nx) for shared typing between frontend and backend.
* Add full JWT-based authentication using Passport.js for NestJS (currently uses a simulated guest login mechanism on the frontend to match the UI).
* Use Server Actions + React Server Components in Next.js to fetch data instead of Client-Side fetching via `useEffect`.
