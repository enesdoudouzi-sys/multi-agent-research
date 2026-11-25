"""Unit tests for Planner, Researcher and Writer agents (mocked LLM calls)."""

from unittest.mock import MagicMock, patch

import pytest


# ── Planner ──────────────────────────────────────────────────────────────────

@patch("agents.planner._client")
def test_plan_returns_three_subtasks(mock_client):
    mock_client.messages.create.return_value = MagicMock(
        content=[MagicMock(text='{"subtasks": ["A", "B", "C"]}')]
    )
    from agents.planner import plan
    result = plan("What causes climate change?")
    assert len(result) == 3
    assert result[0] == "A"


@patch("agents.planner._client")
def test_plan_calls_api_once(mock_client):
    mock_client.messages.create.return_value = MagicMock(
        content=[MagicMock(text='{"subtasks": ["X", "Y", "Z"]}')]
    )
    from agents.planner import plan
    plan("test question")
    mock_client.messages.create.assert_called_once()


# ── Researcher ────────────────────────────────────────────────────────────────

@patch("agents.researcher._client")
def test_research_returns_dict_with_subtask_and_findings(mock_client):
    mock_client.messages.create.return_value = MagicMock(
        content=[MagicMock(text="Detailed findings here.")]
    )
    from agents.researcher import research
    result = research("Main question", "Subtask A")
    assert result["subtask"] == "Subtask A"
    assert "findings" in result
    assert len(result["findings"]) > 0


@patch("agents.researcher._client")
def test_research_includes_question_in_prompt(mock_client):
    mock_client.messages.create.return_value = MagicMock(
        content=[MagicMock(text="findings")]
    )
    from agents.researcher import research
    research("My specific question", "subtask")
    call_args = mock_client.messages.create.call_args
    messages = call_args.kwargs["messages"]
    assert "My specific question" in messages[0]["content"]


# ── Writer ────────────────────────────────────────────────────────────────────

@patch("agents.writer._client")
def test_write_returns_string(mock_client):
    mock_client.messages.create.return_value = MagicMock(
        content=[MagicMock(text="# Report\n\n## Summary\nAll good.")]
    )
    from agents.writer import write
    result = write("question", [{"subtask": "A", "findings": "finding A"}])
    assert isinstance(result, str)
    assert len(result) > 0


@patch("agents.writer._client")
def test_write_merges_all_findings(mock_client):
    mock_client.messages.create.return_value = MagicMock(
        content=[MagicMock(text="report")]
    )
    from agents.writer import write
    findings = [
        {"subtask": "A", "findings": "finding A"},
        {"subtask": "B", "findings": "finding B"},
        {"subtask": "C", "findings": "finding C"},
    ]
    write("question", findings)
    call_args = mock_client.messages.create.call_args
    prompt = call_args.kwargs["messages"][0]["content"]
    assert "finding A" in prompt
    assert "finding B" in prompt
    assert "finding C" in prompt
