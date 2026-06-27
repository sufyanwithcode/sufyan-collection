# Sufyan Collection

> Premium Pakistani fashion brand — 3-Tier DevOps Application

A full-stack e-commerce platform built with React, Node.js/Express, and MongoDB.
Containerised with Docker, orchestrated on Kubernetes, and shipped via a Jenkins CI/CD pipeline.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT BROWSER                   │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP/HTTPS
┌──────────────────────▼──────────────────────────────┐
│            TIER 1 — FRONTEND (React + Nginx)        │
│                  Port 3000 / 80                     │
└──────────────────────┬──────────────────────────────┘
                       │ REST API  /api/*
┌──────────────────────▼──────────────────────────────┐
│           TIER 2 — BACKEND (Node.js / Express)      │
│                     Port 5000                       │
└──────────────────────┬──────────────────────────────┘
                       │ Mongoose
┌──────────────────────▼──────────────────────────────┐
│              TIER 3 — DATABASE (MongoDB)             │
│                    Port 27017                       │
└─────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, React Router v6, Axios  |
| Backend    | Node.js 20, Express 4, JWT        |
| Database   | MongoDB 7, Mongoose ODM           |
| Container  | Docker, Docker Compose            |
| Orchestration | Kubernetes (kubectl / Minikube)|
| CI/CD      | Jenkins Declarative Pipeline      |
| Monitoring | Prometheus + Grafana              |
| Web Server | Nginx (reverse proxy)             |

## Quick Start (Docker Compose)

```bash
git clone https://github.com/sufyanwithcode/sufyan-collection.git
cd sufyan-collection
cp backend/.env.example backend/.env
docker compose up --build -d
# Seed the database
docker exec sc_backend node src/utils/seedData.js
```

| Service         | URL                        |
|-----------------|----------------------------|
| Website         | http://localhost:3000      |
| API             | http://localhost:5000      |
| Prometheus      | http://localhost:9090      |
| Grafana         | http://localhost:3001      |
| Mongo Express   | http://localhost:8081      |

## Default Credentials

| Role  | Email                          | Password    |
|-------|--------------------------------|-------------|
| Admin | admin@sufyan-collection.com    | Admin@123   |
| User  | user@test.com                  | User@123    |

## Project Structure

```
sufyan-collection/
├── frontend/          React application
├── backend/           Express REST API
├── database/          MongoDB init scripts
├── k8s/               Kubernetes manifests
├── jenkins/           Jenkinsfile & CI config
├── monitoring/        Prometheus & Grafana config
├── docs/              All deployment commands
├── docker-compose.yml
└── README.md
```

See `docs/DEPLOYMENT_COMMANDS.md` for all Linux, Docker, Kubernetes, and Jenkins commands.
