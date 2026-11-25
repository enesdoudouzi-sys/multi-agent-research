"""Pydantic models for the API."""

from pydantic import BaseModel, Field


class ResearchRequest(BaseModel):
    question: str = Field(..., min_length=10, max_length=500, description="Research question")


class ResearchResponse(BaseModel):
    question: str
    subtasks: list[str]
    report: str
    status: str = "success"
