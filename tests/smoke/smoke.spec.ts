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

test("quote page: shows every pricing step for a valid quote", async ({
  page,
}) => {
  await page.goto("/quote");
  await page.getByLabel("Robot model").selectOption("standard");
  await page.getByLabel("Quantity").fill("20");
  await page.getByLabel("Lease term").selectOption("24");
  await page.getByLabel("Service").selectOption("full");
  await page.getByRole("button", { name: "Get quote" }).click();
  const quote = page.getByRole("table", { name: "Quote" });
  await expect(quote).toContainText("List price48,000.00 USD");
  await expect(quote).toContainText("Volume discount 5%-2,400.00 USD");
  await expect(quote).toContainText("Term discount 5%-2,280.00 USD");
  await expect(quote).toContainText("Full maintenance+5,000.00 USD");
  await expect(quote).toContainText("Monthly price48,320.00 USD");
  await expect(quote).toContainText("Total over 24 months1,159,680.00 USD");
});

test("quote page: shows every error and no price for impossible input", async ({
  page,
}) => {
  await page.goto("/quote?model=giant&quantity=0&term=5&service=basic");
  const alert = page.getByRole("alert", { name: "Problems with the quote" });
  await expect(alert).toContainText("Robot model must be one of");
  await expect(alert).toContainText("Quantity must be between 1 and 500.");
  await expect(alert).toContainText("Lease term must be 12, 24 or 36 months.");
  await expect(page.getByRole("table", { name: "Quote" })).toHaveCount(0);
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
