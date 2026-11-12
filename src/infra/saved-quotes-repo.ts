import { randomBytes } from "node:crypto";
import {
  calculateQuote,
  parseQuoteRequest,
  type Quote,
  type QuoteRequest,
} from "@/domain/quote";
import type { SavedQuote as Row } from "@/generated/prisma/client";
import { db } from "./db";

// Spec 002. A saved quote is frozen: its amounts are read back, never recalculated.
export type SavedQuote = Quote & { id: string; savedAt: Date };

const ID_PATTERN = /^[A-Za-z0-9_-]{22}$/;

/** 128 random bits, URL-safe. The link is the only protection, so it must not be guessable. */
export function newQuoteId(): string {
  return randomBytes(16).toString("base64url");
}

export async function saveQuote(request: QuoteRequest): Promise<SavedQuote> {
  const { request: req, totalCents, ...amounts } = calculateQuote(request);
  const row = await db().savedQuote.create({
    data: {
      id: newQuoteId(),
      ...req,
      ...amounts,
      totalCents: BigInt(totalCents),
    },
  });
  return toSavedQuote(row);
}

/** Null for an unknown id, and for anything that is not a well-formed id. */
export async function findSavedQuote(id: string): Promise<SavedQuote | null> {
  if (!ID_PATTERN.test(id)) return null;
  const row = await db().savedQuote.findUnique({ where: { id } });
  return row && toSavedQuote(row);
}

function toSavedQuote(row: Row): SavedQuote {
  const {
    id,
    savedAt,
    model,
    quantity,
    term,
    service,
    totalCents,
    ...amounts
  } = row;
  const parsed = parseQuoteRequest({ model, quantity, term, service });
  if (!parsed.ok)
    throw new Error(`Saved quote ${id} holds an invalid request.`);
  return {
    id,
    savedAt,
    request: parsed.value,
    ...amounts,
    totalCents: Number(totalCents),
  };
}
