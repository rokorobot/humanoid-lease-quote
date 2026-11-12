# AGENTS.md

A product repo built by the software factory, from the `web-nextjs` template.

## Hard rules

- Never edit `factory/`, `.github/`, `AGENTS.md`, `CLAUDE.md`, `skills/`, or `.copier-answers.yml` unless your task's change class is `factory`. Those changes need a human code owner.
- Never edit the `specs`, `infra`, `sensor_config`, or `flag_config` paths listed in `factory/project.yaml` unless your change class is `specs`, `infra-ci`, or `factory`. That includes `scripts/` and every lint, type-check and test config.
- Every PR description follows `factory/PR_REPORT_TEMPLATE.md`. Every section is filled in; claim only what you ran.
- Classify your change with `factory/change-classes.yaml`. If several classes match, use the riskiest one.
- Fail closed. If a tool, dependency, credential, or environment step is missing or broken, stop and report it in report section 6. Do not work around it: no `--no-verify`, `--force`, added sleeps or retries, disabled lint rules, or ignore comments.
- Never delete, skip, or loosen an existing test.
- No new dependency without a human-applied `dep-approved` label.
- Never commit secrets or `.env` files.
- One concern per PR. Do nothing the spec or issue did not ask for.

## Commands

Needs Node (version in `.node-version`) and, for the last three, `DATABASE_URL` pointing at a Postgres database whose name ends in `_test`.

- `npm ci`: install exactly what the lockfile says.
- `scripts/check`: format, lint, type check, module boundaries. Run before every commit.
- `scripts/test-changed [base-ref]`: unit tests affected by your diff.
- `scripts/test-all`: every unit test. Must finish within 2 minutes.
- `scripts/mutation [base-ref]`: mutation score for changed `src/domain` files. Must be 70% or more.
- `scripts/test-integration`: tests against a real Postgres.
- `scripts/smoke`: builds the app and checks it in a real browser.
- `scripts/screenshot [url-path]`: saves a screenshot to `reports/screenshots/` for the PR report.
- `scripts/ci [base-ref]`: every gate in order. CI runs exactly this.
- `scripts/seed-db`, `scripts/dev`: local database setup and dev server.

## Where code goes

- `src/domain/<module>/`: business rules. Pure TypeScript and Zod only. Unit tests sit next to the code. Other code imports a module through its `index.ts` only.
- `src/infra/`: database and external services. May import `src/domain`.
- `src/app/`: pages and API routes. Validate all input with the module's Zod schema before using it.
- `tests/integration/`, `tests/smoke/`: tests that need a database or a browser.
- `prisma/`: schema and migrations. Create migrations with `npx prisma migrate dev --name <what-changed>`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
