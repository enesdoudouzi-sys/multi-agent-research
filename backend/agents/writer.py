"""Writer Agent — synthesizes all researcher findings into a final report."""

import anthropic

_client = anthropic.Anthropic()
_MODEL = "claude-sonnet-4-6"

_SYSTEM = """You are an expert research writer. Given a research question and findings from
multiple researchers, synthesize everything into a cohesive, well-structured Markdown report.

Format:
# Research Report: <question>

## Executive Summary
<2-3 sentence overview>

## Findings

### <Subtask 1 title>
<findings>

### <Subtask 2 title>
<findings>

### <Subtask 3 title>
<findings>

## Conclusion
<synthesis and key takeaways>"""


def write(question: str, findings: list[dict]) -> str:
    findings_text = "\n\n".join(
        f"### Researcher on: {f['subtask']}\n{f['findings']}" for f in findings
    )
    response = _client.messages.create(
        model=_MODEL,
        max_tokens=2048,
        system=_SYSTEM,
        messages=[
            {
                "role": "user",
                "content": (
                    f"Research question: {question}\n\n"
                    f"Researcher findings:\n{findings_text}"
                ),
            }
        ],
    )
    return response.content[0].text
