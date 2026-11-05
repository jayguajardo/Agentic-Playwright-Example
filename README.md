# Agentic Playwright Example

Sample project showing Playwright tests planned and generated with Claude Code agents (planner / generator / healer), using the Page Object Model to keep locators and test data out of the specs.

The app under test is the TechMart sample site (served on `http://localhost:3000`). The demo credentials (`demo@techmart.com` / `demo123`) are public sample data.

## Layout
- `specs/` – test plans (`login-page-test-plan.md`)
- `tests/pages/` – page objects
- `tests/data/` – test data and expected messages
- `tests/login/` – login specs
- `.claude/agents/` – Playwright planner, generator and healer agents

## Run
```
npm install
npx playwright install chromium
npx playwright test --project=chromium
```
