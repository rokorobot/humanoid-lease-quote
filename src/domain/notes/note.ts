import { z } from "zod";

export const MAX_TITLE_LENGTH = 120;

/** What a client may send when creating a note. Validated at the boundary. */
export const NoteInput = z.object({
  title: z.string().trim().min(1, "title is required").max(MAX_TITLE_LENGTH),
  body: z.string().max(10_000).default(""),
});
export type NoteInput = z.infer<typeof NoteInput>;

export type Note = NoteInput & { id: string; createdAt: Date };

export type ParseResult =
  | { ok: true; value: NoteInput }
  | { ok: false; errors: string[] };

/** Never throws: returns the cleaned input, or the reasons it was rejected. */
export function parseNoteInput(raw: unknown): ParseResult {
  const result = NoteInput.safeParse(raw);
  if (result.success) return { ok: true, value: result.data };
  return {
    ok: false,
    errors: result.error.issues.map(
      (issue) => `${issue.path.join(".") || "input"}: ${issue.message}`,
    ),
  };
}
