// Module boundary rules. Each `comment` is written as a fix instruction.
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment:
        "Two modules import each other. Move the shared code into a third module that both import.",
      from: {},
      to: { circular: true },
    },
    {
      name: "domain-is-pure",
      severity: "error",
      comment:
        "src/domain holds business rules only. It must not import from src/app, src/infra, next, react, or the database client. Pass the data in as arguments instead.",
      from: { path: "^src/domain/" },
      to: {
        path: "^src/(app|infra|generated)/|node_modules/(next|react|react-dom|@prisma|pg)/",
      },
    },
    {
      name: "infra-not-ui",
      severity: "error",
      comment:
        "src/infra must not import from src/app. Routes and pages call infra, never the other way round.",
      from: { path: "^src/infra/" },
      to: { path: "^src/app/" },
    },
    {
      name: "domain-module-public-api",
      severity: "error",
      comment:
        "Import a domain module only through its index.ts, e.g. '@/domain/notes'. Export what you need from that index.ts.",
      from: { path: "^src/", pathNot: "^src/domain/[^/]+/" },
      to: {
        path: "^src/domain/[^/]+/.+",
        pathNot: "^src/domain/[^/]+/index\\.ts$",
      },
    },
    {
      name: "domain-module-isolation",
      severity: "error",
      comment:
        "One domain module reaches into another's internals. Import the other module's index.ts instead.",
      from: { path: "^src/domain/([^/]+)/" },
      to: {
        path: "^src/domain/[^/]+/.+",
        pathNot: ["^src/domain/$1/", "^src/domain/[^/]+/index\\.ts$"],
      },
    },
    {
      name: "no-orphans-or-unresolved",
      severity: "error",
      comment:
        "This import does not resolve to a file or an installed package. Fix the path.",
      from: {},
      to: { couldNotResolve: true },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: "tsconfig.json" },
    exclude: { path: "^(\\.next|reports|src/generated)/" },
  },
};
