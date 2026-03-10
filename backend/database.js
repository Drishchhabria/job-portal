const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const DB_PATH = path.join(__dirname, "db.json");

// Load db from file
function load() {
  if (!fs.existsSync(DB_PATH)) {
    const initial = { jobs: [], applications: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

// Save db to file
function save(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Seed if empty
function seedIfEmpty() {
  const db = load();
  if (db.jobs.length > 0) return;

  const now = new Date().toISOString();
  db.jobs = [
    {
      id: uuidv4(),
      title: "Frontend Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-Time",
      experience: "2–4 years",
      salary: "$80,000 – $110,000",
      description: "Join our product team to craft beautiful, performant interfaces. You'll work closely with designers and backend engineers to ship features that delight users.",
      requirements: "React, TypeScript, Tailwind CSS, REST APIs, Git workflow, eye for design, strong communication skills",
      is_active: 1,
      created_at: now,
    },
    {
      id: uuidv4(),
      title: "Backend Engineer",
      department: "Engineering",
      location: "New York, NY (Hybrid)",
      type: "Full-Time",
      experience: "3–5 years",
      salary: "$95,000 – $130,000",
      description: "Design and build the systems that power Unizoy at scale. Own entire features from database schema to API design, collaborating across teams.",
      requirements: "Node.js or Python, PostgreSQL, REST & GraphQL, Docker, AWS or GCP, system design fundamentals",
      is_active: 1,
      created_at: now,
    },
    {
      id: uuidv4(),
      title: "Product Design Intern",
      department: "Design",
      location: "Remote",
      type: "Internship",
      experience: "0–1 year",
      salary: "$25/hr",
      description: "A 3-month internship embedded in our design team. You'll run user research sessions, create wireframes and prototypes, and ship real UI to production.",
      requirements: "Figma proficiency, basic UX principles, portfolio of projects, curiosity, willingness to give and receive feedback",
      is_active: 1,
      created_at: now,
    },
  ];
  save(db);
  console.log("✅ Seeded 3 sample jobs");
}

seedIfEmpty();

module.exports = { load, save };