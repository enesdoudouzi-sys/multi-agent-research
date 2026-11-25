"""Planner Agent — breaks a research question into 3 focused subtasks."""

import json

import anthropic

_client = anthropic.Anthropic()
_MODEL = "claude-sonnet-4-6"

_SYSTEM = """You are a research planner. Given a research question, break it into exactly 3
focused, non-overlapping subtasks that together cover the full question.

Respond ONLY with valid JSON in this exact shape:
{"subtasks": ["subtask 1", "subtask 2", "subtask 3"]}"""


def plan(question: str) -> list[str]:
    response = _client.messages.create(
        model=_MODEL,
        max_tokens=512,
        system=_SYSTEM,
        messages=[{"role": "user", "content": f"Research question: {question}"}],
    )
    data = json.loads(response.content[0].text)
    return data["subtasks"]
