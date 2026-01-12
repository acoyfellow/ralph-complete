# RALPH

- PAUSED: false
- MAX_FAILURE_RETRIES: 5

## Loop
1. Load prd.json → first "todo" story
2. Implement minimal change
3. Run guard: bash scripts/ralph/guard.sh scripts/ralph/constraints.json
4. Commit + push

## Commands
- Typecheck: cd ralph-minimal && bun run build
- Tests: cd ralph-minimal && bun run test:prod

## Project Structure
- ralph-minimal/: Main Cloudflare Worker + Container code
  - src/: TypeScript source (index.ts, ralph.ts, container.ts)
  - server.js: Container HTTP API
  - Dockerfile: Container image
- scripts/ralph/: Ralph automation files
- .github/workflows/: CI/CD workflows

## Rules
- One story per iteration
- Never push failing tests
- Keep changes focused in ralph-minimal/
- No dependency changes unless explicitly allowed
