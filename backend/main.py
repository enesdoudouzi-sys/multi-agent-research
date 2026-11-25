"""FastAPI backend for the Multi-Agent Research System."""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from graph.research_graph import graph
from models import ResearchRequest, ResearchResponse

app = FastAPI(
    title="Multi-Agent Research System",
    description="Autonomous research agent powered by Claude — Planner → 3 Researchers → Writer",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/health")
def health():
    return {"status": "ok", "version": "1.0.0"}


@app.post("/research", response_model=ResearchResponse)
def run_research(request: ResearchRequest):
    """Run a full multi-agent research cycle for the given question."""
    try:
        result = graph.invoke({"question": request.question, "findings": []})
        return ResearchResponse(
            question=request.question,
            subtasks=result["subtasks"],
            report=result["report"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
