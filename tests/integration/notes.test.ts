import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { POST } from "@/app/api/notes/route";
import { db } from "@/infra/db";
import { createNote, listNotes } from "@/infra/notes-repo";

function post(body: string): Promise<Response> {
  return POST(new Request("http://test/api/notes", { method: "POST", body }));
}

beforeEach(async () => {
  await db().note.deleteMany();
});
afterAll(async () => {
  await db().$disconnect();
});

describe("notes repository", () => {
  it("stores a note and lists it back", async () => {
    const created = await createNote({ title: "First", body: "hello" });
    expect(created.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(await listNotes()).toEqual([created]);
  });

  it("lists nothing when the table is empty", async () => {
    expect(await listNotes()).toEqual([]);
  });
});

describe("POST /api/notes", () => {
  it("stores a valid note and returns 201", async () => {
    const response = await post(JSON.stringify({ title: "  From the API  " }));
    expect(response.status).toBe(201);
    expect((await listNotes()).map((note) => note.title)).toEqual([
      "From the API",
    ]);
  });

  it.each([
    ["an empty title", JSON.stringify({ title: "" })],
    ["a body that is not JSON", "not json"],
  ])("rejects %s with 400 and stores nothing", async (_name, body) => {
    const response = await post(body);
    expect(response.status).toBe(400);
    expect(await listNotes()).toEqual([]);
  });
});
