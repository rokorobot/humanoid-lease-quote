import { expect, it } from "vitest";
import {
  calculateQuote,
  formatUsd,
  type Model,
  parseQuoteRequest,
  type Service,
} from "./quote";

const q = (
  model: Model,
  quantity: number,
  term = 12,
  service: Service = "basic",
) => calculateQuote({ model, quantity, term, service });
const parse = (over: Record<string, unknown>) =>
  parseQuoteRequest({
    model: "compact",
    quantity: 1,
    term: 12,
    service: "basic",
    ...over,
  });

const QUANTITY = "Quantity must be between 1 and 500.";
const TERM = "Lease term must be 12, 24 or 36 months.";

it("quote: prices each model per robot per month", () => {
  expect(q("compact", 1).monthlyCents).toBe(150_000);
  expect(q("standard", 1).monthlyCents).toBe(240_000);
  expect(q("heavy-duty", 1).monthlyCents).toBe(390_000);
});

it("quote: list price is model price times quantity", () => {
  expect(q("standard", 7).listCents).toBe(1_680_000);
  expect(q("standard", 20).listCents).toBe(4_800_000);
});

it("quote: volume discount by fleet size at 9, 10, 49, 50 and 500 robots", () => {
  const at = (n: number) => q("compact", n);
  expect(at(9)).toMatchObject({ volumePercent: 0, volumeDiscountCents: 0 });
  expect(at(10)).toMatchObject({
    volumePercent: 5,
    volumeDiscountCents: 75_000,
  });
  expect(at(49)).toMatchObject({
    volumePercent: 5,
    volumeDiscountCents: 367_500,
  });
  expect(at(50)).toMatchObject({
    volumePercent: 10,
    volumeDiscountCents: 750_000,
  });
  expect(at(500)).toMatchObject({
    volumePercent: 10,
    volumeDiscountCents: 7_500_000,
  });
  expect(at(9).monthlyCents).toBe(1_350_000);
  expect(at(50).monthlyCents).toBe(6_750_000);
});

it("quote: term discount applies after volume discount", () => {
  expect(q("compact", 20, 12)).toMatchObject({
    termPercent: 0,
    termDiscountCents: 0,
  });
  // 48,000 − 5% = 45,600; 5% of 45,600 = 2,280 (not 5% of 48,000 = 2,400).
  expect(q("standard", 20, 24)).toMatchObject({
    listCents: 4_800_000,
    volumeDiscountCents: 240_000,
    termPercent: 5,
    termDiscountCents: 228_000,
    monthlyCents: 4_332_000,
  });
  expect(q("heavy-duty", 50, 36)).toMatchObject({
    termPercent: 10,
    termDiscountCents: 1_755_000,
    monthlyCents: 15_795_000,
  });
});

it("quote: full maintenance is added after discounts and not discounted", () => {
  const basic = q("standard", 20, 24, "basic");
  const full = q("standard", 20, 24, "full");
  expect(basic.maintenanceCents).toBe(0);
  expect(full.maintenanceCents).toBe(500_000);
  expect(full.monthlyCents).toBe(4_832_000);
});

it("quote: monthly and total are exact to the cent", () => {
  expect(q("compact", 1)).toMatchObject({
    monthlyCents: 150_000,
    totalCents: 1_800_000,
  });
  expect(q("standard", 20, 24, "full").totalCents).toBe(115_968_000);
  // 11 Compact for 24 months: 16,500 × 0.95 × 0.95 = 14,891.25 exactly.
  const odd = q("compact", 11, 24);
  expect(odd).toMatchObject({
    monthlyCents: 1_489_125,
    totalCents: 35_739_000,
  });
  expect(odd.volumeDiscountCents + odd.termDiscountCents).toBe(
    odd.listCents - odd.monthlyCents,
  );
});

it("quote: rejects quantity 0, 501, 2.5 and non-numbers", () => {
  for (const quantity of [0, 501, 2.5, "2.5", "abc", "", -1, null, undefined]) {
    expect(parse({ quantity })).toEqual({ ok: false, errors: [QUANTITY] });
  }
  for (const quantity of [1, "1", " 500 ", 500]) {
    expect(parse({ quantity }).ok).toBe(true);
  }
});

it("quote: rejects terms other than 12, 24 and 36", () => {
  for (const term of [0, 6, 11, 13, 48, "12.0", "x", null]) {
    expect(parse({ term })).toEqual({ ok: false, errors: [TERM] });
  }
  for (const term of [12, "24", 36]) {
    expect(parse({ term })).toMatchObject({
      ok: true,
      value: { term: Number(term) },
    });
  }
});

it("quote: reports every invalid field at once", () => {
  expect(
    parse({ model: "giant", quantity: 0, term: 5, service: "gold" }),
  ).toEqual({
    ok: false,
    errors: [
      "Robot model must be one of: Compact, Standard, Heavy-duty.",
      QUANTITY,
      TERM,
      "Service level must be one of: Basic, Full maintenance.",
    ],
  });
  expect(parseQuoteRequest(null)).toMatchObject({ ok: false });
});

it("accepts a valid request and converts form strings to numbers", () => {
  expect(
    parse({ model: "heavy-duty", quantity: "50", term: "36", service: "full" }),
  ).toEqual({
    ok: true,
    value: { model: "heavy-duty", quantity: 50, term: 36, service: "full" },
  });
});

it("quote: formats amounts as USD with two decimals and separators", () => {
  const cases: [number, string][] = [
    [4_832_000, "48,320.00 USD"],
    [115_968_000, "1,159,680.00 USD"],
    [1_489_125, "14,891.25 USD"],
    [99_999, "999.99 USD"],
    [5, "0.05 USD"],
    [0, "0.00 USD"],
    [-228_000, "-2,280.00 USD"],
  ];
  for (const [cents, text] of cases) expect(formatUsd(cents)).toBe(text);
});
