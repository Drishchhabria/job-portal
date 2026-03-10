Unizoy Job Board
A full-stack job board built as part of the Unizoy internship assignment. Admins can post and manage job listings, candidates can browse and apply — simple as that.
Live demo: [your-vercel-link]
Backend API: [your-render-link]

Features
Candidate side

Browse active job listings, search by keyword, filter by type and department
View full job details — description, requirements, location, salary
Apply with name, email, resume link, and an optional cover note
Can't apply twice to the same job from the same email

Admin side

Login protected with JWT (8hr session)
Post new jobs, edit existing ones, pause/activate or delete them
View every application with candidate info, resume link, and cover note
Update application status — pending, reviewed, shortlisted, rejected
Quick stats on total jobs, active listings, total applications, shortlisted count


Tech Stack
FrontendNext.js 14 (App Router), React 18, Tailwind CSSBackendNode.js, Express.jsDatabaseJSON file via Node.js fs module (no native dependencies)AuthJWTFontsOutfit + DM Sans

Project Structure
unizoy-job-board/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── jobs.js
│   │   └── applications.js
│   ├── database.js        # reads/writes db.json
│   ├── server.js
│   └── .env.example
│
└── frontend/
    ├── app/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── JobCard.js
    │   │   └── ApplyModal.js
    │   ├── jobs/[id]/page.js
    │   ├── admin/page.js
    │   └── page.js
    └── .env.local.example

Running Locally
You need Node.js 18+ installed.
Backend
bashcd backend
npm install
cp .env.example .env
Fill in .env:
envPORT=5000
ADMIN_SECRET=your_admin_password
JWT_SECRET=any_long_random_string
FRONTEND_URL=http://localhost:3000
bashnpm run dev
Runs at http://localhost:5000. Creates db.json and seeds 3 sample jobs on first run.
Frontend
bashcd frontend
npm install
cp .env.local.example .env.local
Fill in .env.local:
envNEXT_PUBLIC_API_URL=http://localhost:5000
bashnpm run dev
Open http://localhost:3000.

Admin Login
Go to /admin and enter the ADMIN_SECRET you set in the backend .env.

API Endpoints
Public
MethodRouteDescriptionGET/api/healthHealth checkGET/api/jobsActive jobs (supports ?search, ?type, ?department)GET/api/jobs/:idSingle job detailPOST/api/applicationsSubmit application
Admin — requires Authorization: Bearer <token>
MethodRouteDescriptionPOST/api/auth/loginGet JWT tokenGET/api/jobs/allAll jobs including inactivePOST/api/jobsCreate jobPATCH/api/jobs/:idUpdate jobDELETE/api/jobs/:idDelete jobGET/api/applicationsAll applicationsGET/api/applications/statsStats per jobPATCH/api/applications/:id/statusUpdate status

Deployment
Frontend → Vercel

Import the repo, set root directory to frontend
Add env var: NEXT_PUBLIC_API_URL=https://your-backend.onrender.com

Backend → Render

New web service, root directory backend
Build: npm install, Start: npm start
Add env vars: ADMIN_SECRET, JWT_SECRET, FRONTEND_URL