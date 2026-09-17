import { describe, expect, it } from "vitest";
import { pickCopy } from "./locale-copy";

describe("pickCopy", () => {
  it("returns English for en-US and interpolates vars", () => {
    expect(pickCopy("en-US", "Welcome, {name}", "Selamat datang, {name}", { name: "Budi" })).toBe(
      "Welcome, Budi"
    );
  });

  it("returns Indonesian for id-ID", () => {
    expect(pickCopy("id-ID", "Sign in", "Masuk")).toBe("Masuk");
  });
});
