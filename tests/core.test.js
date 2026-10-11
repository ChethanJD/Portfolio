import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const read = (p) => fs.readFileSync(path.join(process.cwd(), p), "utf8");
const exists = (p) => fs.existsSync(path.join(process.cwd(), p));

describe("core pages exist + share nav/footer", () => {
  for (const p of ["index.html", "browse.html", "about.html"]) {
    it(p, () => { expect(exists(p)).toBe(true); });
  }
  it("browse has profile + nav hooks", () => {
    const b = read("browse.html");
    expect(b).toMatch(/profile-name/);
    expect(b).toMatch(/nav-menu/);
  });
  it("about has lightbox", () => {
    expect(read("about.html")).toMatch(/imageLightbox/);
  });
});
