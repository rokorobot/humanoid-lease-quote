import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Integration tests: real Postgres (the database's twin). They empty tables, so they only run
// through scripts/test-integration, which refuses any database whose name does not end in _test.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "node",
    include: ["tests/integration/**/*.test.ts"],
    fileParallelism: false,
    testTimeout: 10_000,
  },
});
