import { notFound } from "next/navigation";
import { MODELS, SERVICES } from "@/domain/quote";
import { findSavedQuote } from "@/infra/saved-quotes-repo";
import { QuoteTable } from "../quote-table";

// Renders per request with no loading shell, so it may read the database at the top level.
// Unknown links never get here: src/proxy.ts answers them with a 404. notFound() below only
// covers a quote that disappears between the two lookups (it would show not-found.tsx with 200).
export const instant = false;

export default async function SavedQuotePage({
  params,
}: PageProps<"/quote/[id]">) {
  const { id } = await params;
  const quote = await findSavedQuote(id);
  if (!quote) notFound();
  const { model, quantity, term, service } = quote.request;
  return (
    <main>
      <h1>Saved quote</h1>
      <p>
        {quantity} × {MODELS[model].label}, {term} months,{" "}
        {SERVICES[service].label}. Saved on{" "}
        {quote.savedAt.toISOString().slice(0, 10)} (UTC).
      </p>
      <QuoteTable quote={quote} />
      <p>
        <a href="/quote">New quote</a>
      </p>
    </main>
  );
}
