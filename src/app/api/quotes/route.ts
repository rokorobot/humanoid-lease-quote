import { parseQuoteRequest } from "@/domain/quote";
import { saveQuote } from "@/infra/saved-quotes-repo";

// Spec 002: the quote page's "Save quote" form posts here.
export async function POST(request: Request) {
  const form = await request.formData().catch(() => undefined);
  const parsed = parseQuoteRequest(form && Object.fromEntries(form));
  if (!parsed.ok) {
    return Response.json({ errors: parsed.errors }, { status: 400 });
  }
  const saved = await saveQuote(parsed.value);
  return new Response(null, {
    status: 303,
    headers: { Location: `/quote/${saved.id}` },
  });
}
