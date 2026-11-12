import { describe, expect, it } from "vitest";
import { MAX_TITLE_LENGTH, parseNoteInput } from "./note";

describe("parseNoteInput", () => {
  it("accepts a valid note and trims the title", () => {
    expect(parseNoteInput({ title: "  Buy milk  ", body: "2 litres" })).toEqual(
      {
        ok: true,
        value: { title: "Buy milk", body: "2 litres" },
      },
    );
  });

  it("defaults the body to an empty string", () => {
    expect(parseNoteInput({ title: "x" })).toEqual({
      ok: true,
      value: { title: "x", body: "" },
    });
  });

  it.each([
    ["empty title", { title: "" }],
    ["whitespace-only title", { title: "   " }],
    ["missing title", {}],
    ["null input", null],
    ["title over the limit", { title: "a".repeat(MAX_TITLE_LENGTH + 1) }],
    ["non-string title", { title: 42 }],
  ])("rejects %s", (_name, raw) => {
    const result = parseNoteInput(raw);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.length).toBeGreaterThan(0);
  });

  it("accepts a title exactly at the limit", () => {
    expect(parseNoteInput({ title: "a".repeat(MAX_TITLE_LENGTH) }).ok).toBe(
      true,
    );
  });

  it("says 'input' when the whole payload is wrong", () => {
    const result = parseNoteInput(null);
    expect(result.ok === false && result.errors[0]).toMatch(/^input: /);
  });

  it("names the field in the error", () => {
    const result = parseNoteInput({ title: "" });
    expect(result).toEqual({ ok: false, errors: ["title: title is required"] });
  });
});
