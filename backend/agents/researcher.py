"""Researcher Agent — investigates one subtask and returns structured findings."""

import anthropic

_client = anthropic.Anthropic()
_MODEL = "claude-sonnet-4-6"

_SYSTEM = """You are a thorough research analyst. Given a research subtask, provide a
detailed, factual analysis with key findings, relevant context, and concrete insights.
Structure your response in clear paragraphs. Be precise and cite reasoning where relevant."""


def research(question: str, subtask: str) -> dict:
    response = _client.messages.create(
        model=_MODEL,
        max_tokens=1024,
        system=_SYSTEM,
        messages=[
            {
                "role": "user",
                "content": (
                    f"Overall research question: {question}\n\n"
                    f"Your specific subtask: {subtask}\n\n"
                    "Provide thorough findings for this subtask."
                ),
            }
        ],
    )
    return {"subtask": subtask, "findings": response.content[0].text}
