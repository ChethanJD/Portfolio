#!/usr/bin/env node
// Clean-room add-project CLI: scaffold a project page from a template + insert a card.
// Usage: node automation/add-project.mjs --title "X" --tagline "Y" --slug my-thing [--dry-run]
import fs from "node:fs";
import path from "node:path";

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, cur, i, arr) => {
  if (cur.startsWith("--")) acc.push([cur.slice(2), arr[i + 1] && !arr[i + 1].startsWith("--") ? arr[i + 1] : true]);
  return acc;
}, []));

const title = args.title || "Untitled Project";
const tagline = args.tagline || "One-line value proposition.";
const slug = (args.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "demo") + ".html";
const dry = Boolean(args["dry-run"]);

const tpl = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><link rel="stylesheet" href="../css/base.css"><link rel="stylesheet" href="../css/project.css"></head><body><nav class="navbar"><div class="nav-left"><a class="nav-logo" href="../browse.html">Chethan J D</a></div></nav><header class="project-hero"><span class="badge-large">NEW PROJECT</span><h1>${title}</h1><p class="tagline">${tagline}</p></header><section class="content-section"><div class="content-block"><h2>Problem</h2><p>Describe the user pain.</p></div><div class="content-block"><h2>Solution</h2><p>Describe the approach + evals.</p></div></section><footer class="footer"><a href="../browse.html">← Browse</a></footer></body></html>`;
const out = path.join("projects", slug);
if (dry) { console.log(`[dry-run] would write ${out} (${tpl.length} bytes)`); process.exit(0); }
fs.writeFileSync(out, tpl);
console.log(`wrote ${out}\nNext: add a .daily-card in browse.html linking to projects/${slug}`);
