import type { NextRequest } from "next/server";
import { findSavedQuote } from "@/infra/saved-quotes-repo";

// Spec 002, FR-006. With Cache Components a page starts its response with 200 before it can
// look the quote up, so unknown links are answered here, before the page runs.
export const config = { matcher: "/quote/:id" };

const NOT_FOUND = `<!doctype html><html lang="en"><head><title>Quote not found</title></head>
<body><main><h1>Quote not found.</h1><p><a href="/quote">New quote</a></p></main></body></html>`;

export async function proxy(request: NextRequest) {
  // Ids are URL-safe, so no decoding: a malformed escape is simply not found.
  const id = request.nextUrl.pathname.slice("/quote/".length);
  if (await findSavedQuote(id)) return;
  return new Response(NOT_FOUND, {
    status: 404,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
