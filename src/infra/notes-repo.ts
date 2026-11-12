import type { Note, NoteInput } from "@/domain/notes";
import { db } from "./db";

export async function createNote(input: NoteInput): Promise<Note> {
  return db().note.create({ data: input });
}

export async function listNotes(): Promise<Note[]> {
  return db().note.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    take: 100,
  });
}
