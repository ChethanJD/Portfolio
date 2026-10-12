import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
const read = (p) => fs.readFileSync(path.join(process.cwd(), p), "utf8");
describe("projects + demo", () => {
  it("certificates complete, no duplicates", () => {
    const b = read("browse.html");
    for (const t of ["Software Engineering Job Simulation", "Python Course for Beginners",
      "Working with the OpenAI API", "Prompt Engineering with the OpenAI API",
      "Simulink Onramp", "MATLAB Onramp", "AI/ML for Geodata Analytics",
      "Internship Experience — VLSI"]) {
      expect(b).toContain(t);
    }
    expect(b.match(/assets\/jpmorgan-software-engineering-simulation\.pdf/g).length).toBe(1);
    for (const u of ["assets/scaler-python-beginners.pdf",
      "assets/datacamp-working-with-openai-api.pdf",
      "assets/datacamp-prompt-engineering-openai-api.pdf",
      "assets/mathworks-simulink-onramp.pdf",
      "assets/mathworks-matlab-onramp.pdf"]) {
      expect(b).toContain(u);
    }
  });
  it("no dead project-page links", () => {
    const b = read("browse.html");
    expect(b).not.toMatch(/projects\/sample-/);
    for (const u of ["coffeescope-phi.vercel.app", "cjd-logic-board.netlify.app",
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
