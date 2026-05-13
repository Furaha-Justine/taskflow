# TaskFlow — Agile & DevOps Lab

> A lightweight task management REST API built across two Agile sprints with full CI/CD, testing, and monitoring.

## Product Vision

TaskFlow is a lightweight command-line task management tool that helps individual developers
capture, prioritize, and track daily tasks — providing instant status visibility without leaving the terminal.

## Quick Start

```bash
npm install && npm start   # → http://localhost:3000
npm test                   # → 29 tests, 98.6% coverage
```

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check + uptime |
| POST | /tasks | Create task `{ "title": "..." }` |
| GET | /tasks | List all tasks |
| GET | /tasks?status=open | Filter by status |
| PATCH | /tasks/:id/complete | Mark done |
| DELETE | /tasks/:id | Delete task |

## Agile Artifacts

| Artifact | Location |
|---------|---------|
| Backlog & Sprint Plans | docs/sprint0/BACKLOG_AND_SPRINT_PLANS.md |
| Sprint 1 Review & Retro | docs/sprint1/SPRINT1_REVIEW_AND_RETRO.md |
| Sprint 2 Review & Retro | docs/sprint2/SPRINT2_REVIEW_AND_RETRO.md |
