/**
 * postbuild.mjs — copy runtime assets into dist/ after `tsc`.
 *
 * `tsc` emits dist/index.js which `require("./data.json")`, so the dataset must
 * sit next to it. The CSS and CSV are mirrored so consumers can import them.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = path.resolve(__dirname, "..");
const dist = path.join(pkg, "dist");

fs.mkdirSync(dist, { recursive: true });

for (const file of ["data.json", "chinese-colors.css", "chinese-colors.csv"]) {
  const from = path.join(pkg, "src", file);
  const to = path.join(dist, file);
  if (!fs.existsSync(from)) {
    console.warn(`  ! missing ${from} — run node ../../scripts/build-package-data.mjs first`);
    continue;
  }
  fs.copyFileSync(from, to);
  console.log(`  ✔ dist/${file}`);
}
