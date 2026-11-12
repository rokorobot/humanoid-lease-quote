import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests: no network, no database, no real clock. They sit next to the code.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    testTimeout: 2000,
  },
});
