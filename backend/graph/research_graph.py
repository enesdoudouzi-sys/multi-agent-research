"""LangGraph research graph — Planner → 3 parallel Researchers → Writer."""

import operator
from typing import Annotated, TypedDict

from langgraph.graph import END, StateGraph
from langgraph.types import Send

from agents.planner import plan
from agents.researcher import research
from agents.writer import write


class ResearchState(TypedDict):
    question: str
    subtasks: list[str]
    findings: Annotated[list[dict], operator.add]
    report: str


class ResearcherState(TypedDict):
    question: str
    subtask: str
    findings: Annotated[list[dict], operator.add]


def planner_node(state: ResearchState) -> dict:
    subtasks = plan(state["question"])
    return {"subtasks": subtasks}


def researcher_node(state: ResearcherState) -> dict:
    result = research(state["question"], state["subtask"])
    return {"findings": [result]}


def writer_node(state: ResearchState) -> dict:
    report = write(state["question"], state["findings"])
    return {"report": report}


def fan_out(state: ResearchState) -> list[Send]:
    return [
        Send("researcher", {"question": state["question"], "subtask": task})
        for task in state["subtasks"]
    ]


def build_graph():
    builder = StateGraph(ResearchState)
    builder.add_node("planner", planner_node)
    builder.add_node("researcher", researcher_node)
    builder.add_node("writer", writer_node)

    builder.set_entry_point("planner")
    builder.add_conditional_edges("planner", fan_out, ["researcher"])
    builder.add_edge("researcher", "writer")
    builder.add_edge("writer", END)

    return builder.compile()


graph = build_graph()
