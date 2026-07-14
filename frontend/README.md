# NourishNet — Frontend

A production-grade React frontend for **NourishNet**, a web-based food donation and distribution management system with real-time tracking. This frontend connects directly to the existing NourishNet/Smart Food Redistribution backend (Node.js + Express + MongoDB) — every screen calls a real backend endpoint; nothing is mocked.

---

## Tech Stack

- React 19 + Vite
- Tailwind CSS (with class-based dark mode)
- Redux Toolkit + React Redux
- React Router DOM v6
- Axios (with JWT refresh-token interceptor)
- React Hook Form
- Socket.IO Client (real-time delivery tracking & dashboard updates)
- React Leaflet + OpenStreetMap (keyless maps, pairs with the backend's OSRM routing)
- Recharts (analytics & environmental impact charts)
- Framer Motion (animations)
- React Icons
- React Hot Toast
- Firebase Cloud Messaging (optional, volunteer push notifications)

---

## Project Structure

```
src/
├── api/                 Axios instance + one module per backend route group
├── app/                 App shell, route definitions
├── components/          Reusable + feature UI components
├── features/            Redux Toolkit slices (one folder per domain)
├── hooks/                Custom hooks (auth, socket, geolocation, debounce...)
├── pages/                Route-level pages, grouped by role
├── sockets/               Socket.IO client setup
├── store/                 Redux store configuration
├── utils/                  Formatters, helpers
└── styles/                 Tailwind entry + custom utility classes
```

---

## Getting Started

### 1. Prerequisites

- Node.js 18+ and npm
- The NourishNet backend (`server.zip` you already have) running locally or remotely, with MongoDB connected.

### 2. Install

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SERVER_URL=http://localhost:5000
```

Firebase variables are **optional** — only needed if you want push notifications to work for volunteers. Leave them blank otherwise; the app degrades gracefully (push notifications simply won't be registered, everything else works normally).

### 4. Run the backend

Make sure your NourishNet backend is running (typically on port 5000) with a valid `.env` (MongoDB URI, JWT secrets, etc.) as per the backend's own README.

### 5. Run the frontend

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Important Notes / Backend-Driven Behaviors

This frontend was built by exhaustively analyzing the actual backend source code and Postman collection. A few backend realities directly shape the UI — these are **not bugs in the frontend**, they reflect the real API surface:

- **No "get current user" endpoint.** The logged-in user's profile is persisted from the `/api/auth/login` response into Redux + localStorage and reused across reloads.
- **No password-change-while-logged-in endpoint.** Profile settings route users to the Forgot Password flow instead.
- **NGO and Volunteer profiles are create-once.** There is no update endpoint for either, so the profile screens are a one-time setup wizard, not an editable settings form.
- **NGOs cannot browse a list of volunteers.** Only Admin has `GET /api/admin/volunteers`. The "Assign Volunteer" screen for NGOs accepts a Volunteer ID directly (with a helper note explaining this limitation), since no role-appropriate listing endpoint exists.
- **No `GET /api/pickups` listing endpoint** exists (only `POST` create). Pickup requests are tracked indirectly through donation status.
- **Several admin list endpoints return full unpaginated arrays** (`/api/admin/ngos`, `/volunteers`, `/donations`, `/deliveries`, `/audit-logs`). These tables paginate **client-side**.
- **Donation status and Delivery status are independent state machines.** Completing a delivery does not automatically mark the donation as `delivered` — NGOs/Admins can do this explicitly via the donation status control.
- **Reports** (`/api/admin/reports/donations/:format`, `/deliveries/:format`) are downloaded as binary blobs (PDF/Excel/CSV) and saved directly to disk via the browser.

---

## Available Scripts

| Command           | Description                          |
|--------------------|--------------------------------------|
| `npm run dev`       | Start the Vite dev server            |
| `npm run build`     | Production build to `dist/`          |
| `npm run preview`   | Preview the production build locally |
| `npm run lint`      | Run ESLint                           |

---

## Roles & What They Can Do

| Role        | Capabilities |
|-------------|--------------|
| **Donor**     | Register, create/manage donations with images, view stats |
| **NGO**       | Browse available donations, accept/reject, create pickup requests, assign volunteers, track active deliveries live |
| **Volunteer** | Accept assigned deliveries, update status through the delivery lifecycle, push live GPS location |
| **Admin**     | Full oversight: users, NGOs, volunteers, donations, deliveries, audit logs, analytics, environmental impact, PDF/Excel/CSV reports |

---

## License

Built as a final-year academic / portfolio project. Free to use and extend.
