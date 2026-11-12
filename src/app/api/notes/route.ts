import { connection } from "next/server";
import { parseNoteInput } from "@/domain/notes";
import { createNote, listNotes } from "@/infra/notes-repo";

export async function GET() {
  await connection(); // reads the database, so it must run per request, never at build time
  return Response.json({ notes: await listNotes() });
}

export async function POST(request: Request) {
  const raw: unknown = await request.json().catch(() => undefined);
  const parsed = parseNoteInput(raw);
  if (!parsed.ok) {
    return Response.json({ errors: parsed.errors }, { status: 400 });
  }
  return Response.json(
    { note: await createNote(parsed.value) },
    { status: 201 },
  );
}
