import type { WorkExperience } from "../types";

export const workExperiences: WorkExperience[] = [
  {
    id: "independent-architect",
    role: "Independent Backend Architect & Consultant",
    company: "Self-employed / Open Source",
    location: "Remote",
    startDate: new Date(2023, 0),
    endDate: null,
    bullets: [
      "Architected and developed **ToggleMesh**, an enterprise-grade feature flag and contextual experimentation engine capable of processing 100k+ RPS.",
      "Implemented a **zero-allocation** evaluation engine using C# Source Generators, compiled Expression Trees, and low-level memory management (Span<T>, ref structs).",
      "Designed high-throughput analytics pipelines leveraging **Kafka** for event streaming and **ClickHouse** for real-time OLAP reporting.",
      "Built a Contextual Multi-Armed Bandit (MAB) engine using Bayesian inference to automate traffic shifting toward winning experiment variants.",
      "Developed high-performance native SDKs for .NET, Python, Go, Node.js, client JS/TS/React and Unreal Engine ensuring 100% local evaluation and data privacy.",
      "Provided architectural consulting for various indie projects and freelance clients, focusing on Distributed Systems, DDD, and Cloud Infrastructure."
    ],
    stack: ["C#", ".NET", "Kafka", "ClickHouse", "Redis", "PostgreSQL", "Docker", "DDD", "Microservices"],
    category: ["web"]
  },
  {
    id: "scs-int",
    role: "Backend & DevOps Engineer",
    company: "SCS International",
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