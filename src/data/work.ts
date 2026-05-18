import type { WorkExperience } from "../types";

export const workExperiences: WorkExperience[] = [
  {
    id: "scs-int",
    role: "Backend & DevOps Engineer",
    company: "SCS Int.",
    location: "Remote / UAE",
    startDate: new Date(2026, 2),
    endDate: null,
    bullets: [
      "Contributed to a backend system for analyzing massive datasets for international radio frequency coordination.",
      "Worked on complex SQL queries (SQLAlchemy) across multi-gigabyte SQLite databases.",
      "Designed and implemented backend logic for parsing and processing spatial BLOB data, supporting analysis of service coverage areas and detection of signal interference.",
      "Managed containerized deployments using Docker Compose and Cloudflare Tunnels, with Grafana monitoring.",
      "Improved an OCR pipeline for document uploads and analysis, reducing false positives."
    ],
    stack: ["Python", "FastAPI", "SQLAlchemy", "SQLite", "Docker", "Keycloak", "Caddy", "Grafana"],
    category: ["web"]
  }
];