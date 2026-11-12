import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.SMOKE_PORT ?? 3100);
const baseURL = `http://127.0.0.1:${port}`;

// Smoke tests run against the production build. scripts/smoke builds it first.
export default defineConfig({
  testDir: "tests/smoke",
  outputDir: "reports/playwright",
  reporter: "line",
  forbidOnly: true,
  retries: 0,
  use: { baseURL },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npx next start --port ${port}`,
    url: `${baseURL}/api/health`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
