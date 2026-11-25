# 🔬 Multi-Agent Research System

[![CI](https://github.com/enesdoudouzi-sys/multi-agent-research/actions/workflows/ci.yml/badge.svg)](https://github.com/enesdoudouzi-sys/multi-agent-research/actions/workflows/ci.yml)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![LangGraph](https://img.shields.io/badge/LangGraph-0.2-6366f1)](https://langchain-ai.github.io/langgraph/)
[![Claude](https://img.shields.io/badge/Claude-Sonnet%204.6-f97316)](https://anthropic.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-ready-326CE5?logo=kubernetes&logoColor=white)](https://kubernetes.io)
[![License](https://img.shields.io/badge/License-MIT-22C55E)](LICENSE)

An autonomous multi-agent research system powered by Claude. Ask a question — a Planner decomposes it into 3 subtasks, three Researcher agents run in parallel via LangGraph, and a Writer synthesizes the findings into a structured report.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   React Frontend                        │
└──────────────────────┬──────────────────────────────────┘
                       │  POST /research
┌──────────────────────▼──────────────────────────────────┐
│                     FastAPI                             │
└──────────────────────┬──────────────────────────────────┘
                       │  invoke graph
┌──────────────────────▼──────────────────────────────────┐
│              LangGraph Graph                            │
│                                                         │
│   ┌─────────────┐    fan-out (parallel)                 │
│   │   Planner   │──► Researcher 1 ──┐                   │
│   │   Agent     │──► Researcher 2 ──┼──► Writer Agent   │
│   └─────────────┘──► Researcher 3 ──┘                   │
└─────────────────────────────────────────────────────────┘
              Claude claude-sonnet-4-6 powers every agent
```

**Data flow:**
```
Question → FastAPI → Planner → [R1 ‖ R2 ‖ R3] → Writer → Markdown Report
```

## ✨ Features

- **Multi-agent loop** — Planner, Researcher ×3 and Writer each run as independent Claude calls
- **True parallelism** — LangGraph's `Send` API fans the three researchers out concurrently
- **FastAPI backend** — typed REST API with Pydantic v2, CORS, health check
- **React frontend** — clean TypeScript UI with live status updates
- **Docker Compose** — one command to run everything locally
- **Kubernetes** — production-ready manifests with health probes, resource limits, Ingress
- **CI/CD** — GitHub Actions: backend tests + frontend build on every push

## 🚀 Quickstart (Docker)

```bash
git clone https://github.com/enesdoudouzi-sys/multi-agent-research
cd multi-agent-research
cp .env.example .env        # add your ANTHROPIC_API_KEY
docker-compose up --build
```

→ Frontend: http://localhost:5173  
→ API Docs: http://localhost:8000/docs

## 💻 Local Development

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install && npm run dev
```

**Example request:**
```bash
curl -X POST http://localhost:8000/research \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the main causes and solutions for climate change?"}'
```

**Example response:**
```json
{
  "question": "What are the main causes and solutions for climate change?",
  "subtasks": [
    "Causes of climate change: fossil fuels, deforestation, agriculture",
    "Impact and current state of global warming",
    "Solutions: renewable energy, policy, carbon capture"
  ],
  "report": "# Research Report: ...\n\n## Executive Summary\n..."
}
```

## ☸️ Kubernetes Deployment

```bash
# Apply all manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secret.yaml      # update ANTHROPIC_API_KEY first
kubectl apply -f k8s/

# Check status
kubectl get pods -n multi-agent-research
kubectl get ingress -n multi-agent-research
```

The backend runs with 2 replicas, liveness + readiness probes on `/health`, and resource limits of 500m CPU / 512Mi RAM per pod.

## 🔌 API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/research` | Run full research cycle |
| `GET` | `/docs` | Swagger UI |

## 📁 Project Structure

```
multi-agent-research/
├── backend/
│   ├── agents/
│   │   ├── planner.py       # Breaks question into 3 subtasks
│   │   ├── researcher.py    # Researches one subtask
│   │   └── writer.py        # Synthesizes findings into report
│   ├── graph/
│   │   └── research_graph.py  # LangGraph StateGraph with parallel fan-out
│   ├── main.py              # FastAPI app
│   ├── models.py            # Pydantic models
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                # React + TypeScript + Vite
├── k8s/                     # Kubernetes manifests
│   ├── namespace.yaml
│   ├── secret.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   └── ingress.yaml
├── .github/
│   ├── workflows/ci.yml
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── docker-compose.yml
├── .env.example
├── CONTRIBUTING.md
└── LICENSE
```

## 🧪 Tests

```bash
cd backend && pytest tests/ -v
```

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## 📄 License

MIT — see [LICENSE](LICENSE).
