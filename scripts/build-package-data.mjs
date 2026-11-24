#!/usr/bin/env node
/**
 * build-package-data.mjs — copy the open sample into the npm package.
 *
 * The single source of truth is `data/sample.json`. This script writes:
 *   packages/chinese-colors/src/data.json
 *   packages/chinese-colors/src/chinese-colors.css
 *   packages/chinese-colors/src/chinese-colors.csv
 *
 * `packages/chinese-colors/src/postbuild.mjs` then copies the three files into
 * `dist/` after `tsc` runs.
 *
 * Usage: node scripts/build-package-data.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SAMPLE = path.join(ROOT, "data", "sample.json");
const PKG_SRC = path.join(ROOT, "packages", "chinese-colors", "src");

const data = JSON.parse(fs.readFileSync(SAMPLE, "utf8"));
if (!Array.isArray(data.colors) || !data.colors.length) {
  throw new Error("data/sample.json has no colours");
}

fs.mkdirSync(PKG_SRC, { recursive: true });
fs.writeFileSync(path.join(PKG_SRC, "data.json"), JSON.stringify(data, null, 2) + "\n");

const css = [
  "/* Chinese Colour Library — open sample (33 colours)",
  " * Data: CC BY 4.0 — YIVA Digital (https://yivadigital.com/colors)",
  " * Code: MIT. Pantone/CSS values are nearest approximations, not official references.",
  " */",
  ":root {",
  ...data.colors.map(
    (c) => `  --cn-${c.slug}: ${c.hex}; /* ${c.name}${c.enName ? " · " + c.enName : ""} */`,
  ),
  "}",
  "",
].join("\n");
fs.writeFileSync(path.join(PKG_SRC, "chinese-colors.css"), css);

const esc = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const header = [
  "slug",
  "name",
  "pinyin",
  "enName",
  "hex",
  "rgb",
  "hsl",
  "oklch",
  "family",
  "familyEn",
  "system",
  "term",
  "termEn",
  "role",
  "roleEn",
  "cssName",
  "cssHex",
  "cssDeltaE",
  "pantoneName",
  "pantoneHex",
  "pantoneDeltaE",
  "credibility",
];
const rows = data.colors.map((c) =>
  [
    c.slug,
    c.name,
    c.pinyin,
    c.enName,
    c.hex,
    c.rgb?.join(" "),
    c.hsl?.join(" "),
    c.oklch?.join(" "),
    c.family,
    c.familyEn,
    c.system,
    c.term,
    c.termEn,
    c.role,
    c.roleEn,
    c.css?.name,
    c.css?.hex,
    c.css?.deltaE,
    c.pantone?.name,
    c.pantone?.hex,
    c.pantone?.deltaE,
    c.credibility,
  ]
    .map(esc)
    .join(","),
);
fs.writeFileSync(path.join(PKG_SRC, "chinese-colors.csv"), [header.join(","), ...rows, ""].join("\n"));

console.log(
  `build-package-data: ${data.colors.length} colours -> packages/chinese-colors/src/ (data.json, .css, .csv)`,
);
