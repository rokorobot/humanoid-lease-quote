import { afterAll, beforeEach, expect, it } from "vitest";
import { POST } from "@/app/api/quotes/route";
import { db } from "@/infra/db";
import {
  findSavedQuote,
  newQuoteId,
  saveQuote,
} from "@/infra/saved-quotes-repo";

const request = {
  model: "standard",
  quantity: 20,
  term: 24,
  service: "full",
} as const;

function post(fields: Record<string, string>): Promise<Response> {
  const body = new URLSearchParams(fields);
  return POST(new Request("http://test/api/quotes", { method: "POST", body }));
}

beforeEach(async () => {
  await db().savedQuote.deleteMany();
});
afterAll(async () => {
  await db().$disconnect();
});

it("saved quote: stores the request, every amount and the save time", async () => {
  const before = Date.now();
  const saved = await saveQuote(request);
  const row = await db().savedQuote.findUniqueOrThrow({
    where: { id: saved.id },
  });
  expect(row).toMatchObject({
    ...request,
    listCents: 4_800_000,
    volumePercent: 5,
    volumeDiscountCents: 240_000,
    termPercent: 5,
    termDiscountCents: 228_000,
    maintenanceCents: 500_000,
    monthlyCents: 4_832_000,
    totalCents: 115_968_000n,
  });
  expect(row.savedAt.getTime()).toBeGreaterThanOrEqual(before - 1000);
  expect(row.savedAt.getTime()).toBeLessThanOrEqual(Date.now() + 1000);
  const largest = await saveQuote({
    ...request,
    model: "heavy-duty",
    quantity: 500,
    term: 36,
  });
  expect((await findSavedQuote(largest.id))?.totalCents).toBe(6_136_200_000);
});

it("saved quote: ids are random and not sequential", async () => {
  const ids = [];
  for (let i = 0; i < 5; i++) ids.push((await saveQuote(request)).id);
  expect(new Set(ids).size).toBe(5);
  for (const id of ids) expect(id).toMatch(/^[A-Za-z0-9_-]{22}$/);
  expect(ids.some((id) => /^\d+$/.test(id))).toBe(false);
});

it("saved quote: shows stored amounts, not recalculated ones", async () => {
  const saved = await saveQuote(request);
  await db().savedQuote.update({
    where: { id: saved.id },
    data: { monthlyCents: 1 },
  });
  expect(await findSavedQuote(saved.id)).toMatchObject({
    id: saved.id,
    request,
    monthlyCents: 1,
    totalCents: 115_968_000,
  });
});

it("saved quote: unknown or malformed link is not found", async () => {
  await saveQuote(request);
  for (const id of [newQuoteId(), "1", "", "../etc/passwd", "a".repeat(23)]) {
    expect(await findSavedQuote(id)).toBeNull();
  }
});

it("saved quote: invalid input is rejected and nothing is stored", async () => {
  const response = await post({
    model: "giant",
    quantity: "0",
    term: "5",
    service: "full",
  });
  expect(response.status).toBe(400);
  expect(await response.json()).toEqual({
    errors: [
      "Robot model must be one of: Compact, Standard, Heavy-duty.",
      "Quantity must be between 1 and 500.",
      "Lease term must be 12, 24 or 36 months.",
    ],
  });
  const notAForm = await POST(
    new Request("http://test/api/quotes", { method: "POST" }),
  );
  expect(notAForm.status).toBe(400);
  expect(await db().savedQuote.count()).toBe(0);
});

it("a valid save redirects to the saved quote's link", async () => {
  const response = await post({
    model: "standard",
    quantity: "20",
    term: "24",
    service: "full",
  });
  expect(response.status).toBe(303);
  const [row] = await db().savedQuote.findMany();
  expect(response.headers.get("Location")).toBe(`/quote/${row?.id}`);
});
