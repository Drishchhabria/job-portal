Unizoy Job Board

This is a simple full-stack job board I built for the Unizoy internship assignment.
Admins can post and manage job listings, and candidates can browse jobs and apply with their details.

Live Demo: [https://job-portal-six-lovat.vercel.app/]


Features

Candidate side

Browse available job listings

View full job details

Apply with name, email, resume link and an optional cover note

Prevents duplicate applications from the same email

Admin side

Login using admin secret (JWT session)

Post, edit, activate/pause or delete jobs

View all applications with candidate info

Update application status (pending, reviewed, shortlisted, rejected)

Basic dashboard stats

Tech Stack

Frontend: Next.js, React, Tailwind CSS
Backend: Node.js, Express
Auth: JWT
Storage: JSON file using Node.js fs

Running Locally

Backend

cd backend
npm install
cp .env.example .env
npm run dev

Frontend

cd frontend
npm install
cp .env.local.example .env.local
npm run dev

Open http://localhost:3000

Deployment

Frontend deployed on Vercel
Backend deployed on Render

Environment variables are included in .env.example for setup.