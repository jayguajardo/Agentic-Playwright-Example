# Playwright Testing – Claude instructions

## MCP session rule
- The `playwright-test` MCP server (defined in this project's `.mcp.json`, runs `npx playwright run-test-mcp-server`) is used **only** in this project – the folder containing this CLAUDE.md, whatever it is named.
- Claude Code sessions for Playwright work must be started with this folder as the primary working directory. Never run the Playwright planner/generator/healer agents from a session rooted in any other folder – the MCP server won't be loaded there and the agents will have no browser or save tools.
- Before invoking `playwright-test-planner`, `playwright-test-generator` or `playwright-test-healer`, confirm the `mcp__playwright-test__*` tools are available. If they are not, stop and tell the user to open a new session in this folder and approve the `playwright-test` server (check with `/mcp`). Do not fall back to inventing locators.

## Project facts
- App under test: TechMart sample app at `http://localhost:3000` (plain http – the server is Express, no TLS). `baseURL` is set in `playwright.config.ts`.
- Seed file: `tests/seed.spec.ts`.
- Test plans live in `specs/` as `<page>-test-plan.md` (see `specs/login-page-test-plan.md` for format).
- App source: `C:\Users\j\Documents\TEST - Tech Mart Site\software-testing-course-main\software-testing-course-main\sample-app`.
