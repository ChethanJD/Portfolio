import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
const read = (p) => fs.readFileSync(path.join(process.cwd(), p), "utf8");
describe("projects + demo", () => {
  it("no dead project-page links", () => {
    const b = read("browse.html");
    expect(b).not.toMatch(/projects\/sample-/);
    for (const u of ["coffeescope.vercel.app", "cjd-logic-board.netlify.app",
      "github.com/ChethanJD/vlsi-rtl-verification-mcp",
      "github.com/ChethanJD/MNIST-Digit-Recognition",
      "github.com/ChethanJD/Human-Activity-Recognition-CNN-LSTM"]) {
      expect(b).toContain(u);
    }
  });
  it("wifivision demo has canvas + thresholds", () => {
    const h = read("demos/wifivision/index.html");
    expect(h).toMatch(/id="room"/); expect(h).toMatch(/id="wave"/); expect(h).toMatch(/0\.14/);
  });
  it("css tokens + pwa present", () => {
    expect(read("css/tokens.css")).toMatch(/--brand/);
    expect(read("sw.js")).toMatch(/caches.open/);
    expect(read("manifest.webmanifest")).toMatch(/start_url/);
  });
});
