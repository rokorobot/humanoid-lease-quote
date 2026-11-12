import { z } from "zod";

// Spec 001. All amounts are whole US cents, so no floating-point error reaches a price.

export const MODELS = {
  compact: { label: "Compact", monthlyCents: 150_000 },
  standard: { label: "Standard", monthlyCents: 240_000 },
  "heavy-duty": { label: "Heavy-duty", monthlyCents: 390_000 },
} as const;
export type Model = keyof typeof MODELS;

export const SERVICES = {
  basic: { label: "Basic", perRobotCents: 0 },
  full: { label: "Full maintenance", perRobotCents: 25_000 },
} as const;
export type Service = keyof typeof SERVICES;

export const TERMS = [12, 24, 36] as const;
export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 500;

const QUANTITY_MESSAGE = `Quantity must be between ${MIN_QUANTITY} and ${MAX_QUANTITY}.`;
const TERM_MESSAGE = "Lease term must be 12, 24 or 36 months.";
const MODEL_MESSAGE =
  "Robot model must be one of: Compact, Standard, Heavy-duty.";
const SERVICE_MESSAGE =
  "Service level must be one of: Basic, Full maintenance.";

/** Accepts a whole number, or a string holding only digits. Anything else is not a number. */
const wholeNumber = (message: string) =>
  z
    .union([z.number(), z.string().trim().regex(/^\d+$/, { error: message })], {
      error: message,
    })
    .transform(Number)
    .pipe(z.number({ error: message }).int({ error: message }));

/** What a client may send to get a quote. Form fields arrive as strings. */
export const QuoteRequest = z.object({
  model: z.enum(["compact", "standard", "heavy-duty"], {
    error: MODEL_MESSAGE,
  }),
  quantity: wholeNumber(QUANTITY_MESSAGE).refine(
    (n) => n >= MIN_QUANTITY && n <= MAX_QUANTITY,
    {
      error: QUANTITY_MESSAGE,
    },
  ),
  term: wholeNumber(TERM_MESSAGE).refine(
    (n) => (TERMS as readonly number[]).includes(n),
    { error: TERM_MESSAGE },
  ),
  service: z.enum(["basic", "full"], { error: SERVICE_MESSAGE }),
});
export type QuoteRequest = z.infer<typeof QuoteRequest>;

export type ParseResult =
  | { ok: true; value: QuoteRequest }
  | { ok: false; errors: string[] };

/** Never throws. Returns the request, or every reason it was rejected, one message per field. */
export function parseQuoteRequest(raw: unknown): ParseResult {
  const result = QuoteRequest.safeParse(raw);
  if (result.success) return { ok: true, value: result.data };
  const byField = new Map<string, string>();
  for (const issue of result.error.issues) {
    const field = String(issue.path[0] ?? "input");
    if (!byField.has(field)) byField.set(field, issue.message);
  }
  return { ok: false, errors: [...byField.values()] };
}

export function volumeDiscountPercent(quantity: number): number {
  if (quantity >= 50) return 10;
  if (quantity >= 10) return 5;
  return 0;
}

export function termDiscountPercent(term: number): number {
  if (term === 36) return 10;
  if (term === 24) return 5;
  return 0;
}

export type Quote = {
  request: QuoteRequest;
  listCents: number;
  volumePercent: number;
  volumeDiscountCents: number;
  termPercent: number;
  termDiscountCents: number;
  maintenanceCents: number;
  monthlyCents: number;
  totalCents: number;
};

/** Divides and rounds half up. Inputs are non-negative whole numbers. */
function divideRoundHalfUp(numerator: number, divisor: number): number {
  return Math.floor((2 * numerator + divisor) / (2 * divisor));
}

export function calculateQuote(request: QuoteRequest): Quote {
  const { model, quantity, term, service } = request;
  const listCents = MODELS[model].monthlyCents * quantity;
  const volumePercent = volumeDiscountPercent(quantity);
  const termPercent = termDiscountPercent(term);
  // Exact values in hundredths and ten-thousandths of a cent; rounded only at the end (FR-006).
  const afterVolume = listCents * (100 - volumePercent);
  const afterTerm = afterVolume * (100 - termPercent);
  const discountedCents = divideRoundHalfUp(afterTerm, 10_000);
  const maintenanceCents = SERVICES[service].perRobotCents * quantity;
  const monthlyCents = discountedCents + maintenanceCents;
  const volumeDiscountCents = listCents - divideRoundHalfUp(afterVolume, 100);
  return {
    request,
    listCents,
    volumePercent,
    volumeDiscountCents,
    termPercent,
    termDiscountCents: listCents - volumeDiscountCents - discountedCents,
    maintenanceCents,
    monthlyCents,
    totalCents: monthlyCents * term,
  };
}

/** "48,320.00 USD". Independent of locale (spec 001, edge cases). */
export function formatUsd(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const dollars = String(Math.floor(abs / 100)).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ",",
  );
  const rest = String(abs % 100).padStart(2, "0");
  return `${sign}${dollars}.${rest} USD`;
}
