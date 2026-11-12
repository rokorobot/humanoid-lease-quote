# humanoid-lease-quote

Built by the software factory from the `web-nextjs` template: Next.js, TypeScript, Prisma on Postgres, Zod.

## Start

```bash
npm ci
export DATABASE_URL=postgresql://<user>@localhost:5432/<database>
scripts/seed-db     # apply migrations and load sample data
scripts/dev         # http://localhost:3000
```

## Before you open a PR

```bash
scripts/check       # format, lint, types, module boundaries
scripts/test-all    # unit tests
scripts/ci          # everything CI runs; needs a database whose name ends in _test
```

Rules for agents, the full command list, and where code goes: [AGENTS.md](AGENTS.md).
