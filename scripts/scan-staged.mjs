#!/usr/bin/env node
// Scans staged changes for secrets. Same check the pre-commit hook runs.
//   npm run secrets:staged

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const exe = process.platform === "win32" ? "gitleaks.exe" : "gitleaks";
const local = path.join(root, ".git", "gitleaks", exe);

function findBinary() {
  if (existsSync(local)) return local;
  const which = spawnSync(process.platform === "win32" ? "where" : "which", ["gitleaks"], {
    encoding: "utf8",
  });
  if (which.status === 0) {
    const first = which.stdout.split(os.EOL).map((line) => line.trim()).find(Boolean);
    if (first) return first;
  }
  return null;
}

const binary = findBinary();
if (!binary) {
  process.stderr.write("gitleaks not found. Run: npm run hooks:install\n");
  process.exit(0);
}

try {
  execFileSync(binary, ["git", "--pre-commit", "--staged", "--redact", "--no-banner", "--exit-code", "1"], {
    cwd: root,
    stdio: "inherit",
  });
  process.stdout.write("no secrets in staged changes\n");
} catch (error) {
  process.exit(error.status ?? 1);
}
