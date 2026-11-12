import { expect, test } from "@playwright/test";

test("the home page renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("It works");
});

test("the health endpoint answers", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ status: "ok" });
});

test("a note can be created and listed over HTTP", async ({ request }) => {
  const title = `smoke ${Date.now()}`;
  const created = await request.post("/api/notes", { data: { title } });
  expect(created.status()).toBe(201);

  const listed = await request.get("/api/notes");
  const { notes } = (await listed.json()) as { notes: { title: string }[] };
  expect(notes.map((note) => note.title)).toContain(title);
});

test("an invalid note is rejected with 400", async ({ request }) => {
  const response = await request.post("/api/notes", { data: { title: "" } });
  expect(response.status()).toBe(400);
});

// scripts/screenshot runs only this test. SCREENSHOT_PATH picks the page, e.g. /settings.
test("screenshot", async ({ page }) => {
  const path = process.env.SCREENSHOT_PATH ?? "/";
  const name =
    path.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "home";
  await page.goto(path);
  await page.screenshot({
    path: `reports/screenshots/${name}.png`,
    fullPage: true,
  });
});
