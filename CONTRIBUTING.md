# Contributing

## Setup

```bash
git clone https://github.com/enesdoudouzi-sys/multi-agent-research
cd multi-agent-research
cp .env.example .env   # add ANTHROPIC_API_KEY
pip install -r backend/requirements.txt
cd backend && uvicorn main:app --reload
```

## Workflow

1. Fork the repo and create a branch: `git checkout -b feat/my-feature`
2. Make changes and add tests
3. Run `pytest backend/tests/ -v` — all tests must pass
4. Open a pull request

## Code style

- Python: follow PEP 8, use type hints
- TypeScript: use strict mode
- Commit messages: `feat:`, `fix:`, `docs:`, `refactor:`
