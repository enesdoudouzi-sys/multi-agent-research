"""Integration tests for the FastAPI endpoints (mocked graph)."""

from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_research_empty_question_returns_422():
    response = client.post("/research", json={"question": ""})
    assert response.status_code == 422


def test_research_too_short_question_returns_422():
    response = client.post("/research", json={"question": "short"})
    assert response.status_code == 422


@patch("main.graph")
def test_research_success(mock_graph):
    mock_graph.invoke.return_value = {
        "question": "What causes climate change?",
        "subtasks": ["Causes", "Effects", "Solutions"],
        "findings": [],
        "report": "# Report\n\nContent here.",
    }
    response = client.post(
        "/research",
        json={"question": "What causes climate change?"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["subtasks"]) == 3
    assert "report" in data


@patch("main.graph")
def test_research_graph_error_returns_500(mock_graph):
    mock_graph.invoke.side_effect = RuntimeError("LLM unavailable")
    response = client.post(
        "/research",
        json={"question": "What causes climate change?"},
    )
    assert response.status_code == 500
