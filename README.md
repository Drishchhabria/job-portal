# Unizoy Job Board

A full-stack job board application built for **Unizoy**, where admins can post and manage job listings, and candidates can browse and apply in seconds.

---

## ✨ Features

### Public (Candidate-Facing)
- 📋 Browse all active job listings with live search and filters
- 🔍 Filter by job type (Full-Time, Part-Time, Contract, Internship) and department
- 📄 View full job detail — description, requirements, meta info
- 📝 Apply with name, email, resume link, and optional cover note
- ✅ Duplicate application detection (one application per email per job)

### Admin Dashboard
- 🔐 Secure JWT-based admin login
- ➕ Post new job listings with full form
- ✏️ Edit existing job postings
- 🔛 Pause / Activate job listings
- 🗑️ Delete jobs (cascades to applications)
- 📥 View all applications with applicant details
- 🔗 Direct links to candidate resumes
- 🏷️ Update application status (Pending → Reviewed → Shortlisted → Rejected)
- 📊 Stats overview (total jobs, active jobs, applications, shortlisted)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | SQLite via `better-sqlite3` |
| Auth | JWT (`jsonwebtoken`) |
| Fonts | Outfit + DM Sans (Google Fonts) |

---

## 📁 Project Structure

```
unizoy-job-board/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT admin middleware
│   ├── routes/
│   │   ├── jobs.js          # CRUD job endpoints
│   │   └── applications.js  # Application endpoints
│   ├── database.js          # SQLite setup + seed data
│   ├── server.js            # Express entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── app/
    │   ├── components/
    │   │   ├── Navbar.js       # Top navigation
    │   │   ├── JobCard.js      # Job listing card
    │   │   └── ApplyModal.js   # Application modal
    │   ├── jobs/[id]/
    │   │   └── page.js         # Job detail page
    │   ├── admin/
    │   │   └── page.js         # Admin dashboard
    │   ├── globals.css
    │   ├── layout.js
    │   └── page.js             # Home / job listings
    ├── tailwind.config.js
    ├── package.json
    └── .env.local.example
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/unizoy-job-board.git
cd unizoy-job-board
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
ADMIN_SECRET=your_admin_password_here
JWT_SECRET=any_long_random_string_here
FRONTEND_URL=http://localhost:3000
```

Start the backend:
```bash
npm run dev       # development (with nodemon)
# or
npm start         # production
```

The API will run at `http://localhost:5000`.  
It auto-creates the SQLite database and seeds 3 sample jobs on first run.

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create your `.env.local` file:
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🔐 Admin Access

1. Navigate to `http://localhost:3000/admin`
2. Enter the `ADMIN_SECRET` you set in the backend `.env`
3. You'll receive a JWT valid for **8 hours**

---

## 📡 API Reference

### Public Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/jobs` | List active jobs (supports `?search=`, `?type=`, `?department=`) |
| GET | `/api/jobs/:id` | Get single job |
| POST | `/api/applications` | Submit application |

### Admin Endpoints (Require `Authorization: Bearer <token>`)

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/login` | Admin login → returns JWT |
| GET | `/api/jobs/all` | List all jobs including inactive |
| POST | `/api/jobs` | Create new job |
| PATCH | `/api/jobs/:id` | Update job |
| DELETE | `/api/jobs/:id` | Delete job |
| GET | `/api/applications` | List all applications |
| GET | `/api/applications/stats` | Application count stats |
| PATCH | `/api/applications/:id/status` | Update application status |

---

## 🌐 Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Set environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url.com`

### Backend → Railway / Render

1. Create a new web service pointing to the `backend/` directory
2. Set environment variables: `ADMIN_SECRET`, `JWT_SECRET`, `FRONTEND_URL`
3. Start command: `npm start`

> **Note:** For production, consider migrating from SQLite to PostgreSQL. The query structure is standard SQL and easy to migrate.

---

## 📸 Screenshots

| Page | Description |
|---|---|
| `/` | Job listings with search + filters |
| `/jobs/:id` | Full job detail + Apply button |
| `/admin` | Admin login + dashboard |
| `/admin` (logged in) | Post jobs, view applications, update statuses |

---

## 🧑‍💻 Author

Built with care as part of the Unizoy internship assignment.

---

## 📄 License

MIT
