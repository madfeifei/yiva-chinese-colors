#!/usr/bin/env node
// Installs the gitleaks pre-commit hook for this clone.
//   node scripts/install-hooks.mjs             install hook + gitleaks binary
//   node scripts/install-hooks.mjs --no-download   only point git at .githooks
//
// The binary lives in .git/gitleaks/ so it is never committed.

import { execFileSync } from "node:child_process";
import { chmodSync, createWriteStream, existsSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
import https from "node:https";

const VERSION = "8.30.1";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const quiet = process.argv.includes("--quiet");
const noDownload = process.argv.includes("--no-download") || process.env.CI === "true";

function log(message) {
  if (!quiet) process.stdout.write(`${message}\n`);
}

function git(args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

function hasGit() {
  try {
    git(["rev-parse", "--is-inside-work-tree"]);
    return true;
  } catch {
    return false;
  }
}

function target() {
  const platform = process.platform;
  const arch = process.arch;
  if (platform === "win32") {
    if (arch !== "x64" && arch !== "arm64") return null;
    return {
      archive: `gitleaks_${VERSION}_windows_${arch}.zip`,
      extract: "zip",
    };
  }
  if (platform === "darwin") {
    const a = arch === "arm64" ? "arm64" : "x64";
    return { archive: `gitleaks_${VERSION}_darwin_${a}.tar.gz`, extract: "tar" };
  }
  if (platform === "linux") {
    const a = arch === "arm64" ? "arm64" : "x64";
    return { archive: `gitleaks_${VERSION}_linux_${a}.tar.gz`, extract: "tar" };
  }
  return null;
}

function download(url, destination) {
  return new Promise((resolve, reject) => {
    const follow = (current) => {
      https
        .get(current, { headers: { "user-agent": "yiva-chinese-colors-hooks" } }, (res) => {
          if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            res.resume();
            follow(res.headers.location);
            return;
          }
          if (res.statusCode !== 200) {
            reject(new Error(`download failed: HTTP ${res.statusCode}`));
            res.resume();
            return;
          }
          const file = createWriteStream(destination);
          res.pipe(file);
          file.on("finish", () => file.close(resolve));
          file.on("error", reject);
        })
        .on("error", reject);
    };
    follow(url);
  });
}

async function installBinary() {
  if (existsSync(path.join(root, ".git")) === false) return;
  const binaryDir = path.join(root, ".git", "gitleaks");
  const exe = path.join(binaryDir, process.platform === "win32" ? "gitleaks.exe" : "gitleaks");
  if (existsSync(exe)) {
    log("gitleaks: already installed");
    return;
  }
  if (noDownload) {
    log("gitleaks: skipped download (CI or --no-download)");
    return;
  }
  const t = target();
  if (!t) {
    log(`gitleaks: no prebuilt binary for ${process.platform}/${process.arch}, install it manually`);
    return;
  }
  mkdirSync(binaryDir, { recursive: true });
  const archivePath = path.join(os.tmpdir(), t.archive);
  const url = `https://github.com/gitleaks/gitleaks/releases/download/v${VERSION}/${t.archive}`;
  log(`gitleaks: downloading v${VERSION} (${t.archive})`);
  await download(url, archivePath);
  if (t.extract === "zip") {
    execFileSync(
      "powershell",
      ["-NoProfile", "-Command", `Expand-Archive -LiteralPath '${archivePath}' -DestinationPath '${binaryDir}' -Force`],
      { stdio: "ignore" },
    );
  } else {
    execFileSync("tar", ["-xzf", archivePath, "-C", binaryDir, "gitleaks"], { stdio: "ignore" });
    chmodSync(exe, 0o755);
  }
  rmSync(archivePath, { force: true });
  if (!existsSync(exe)) throw new Error("gitleaks binary missing after extraction");
  log("gitleaks: installed");
}

async function main() {
  if (!hasGit()) {
    log("hooks: not a git clone, nothing to install");
    return;
  }
  git(["config", "core.hooksPath", ".githooks"]);
  log("hooks: core.hooksPath -> .githooks");
  try {
    chmodSync(path.join(root, ".githooks", "pre-commit"), 0o755);
  } catch {
    // Windows does not need the executable bit.
  }
  await installBinary();
}

main().catch((error) => {
  process.stderr.write(`hooks: ${error.message}\n`);
  process.exitCode = 0;
});
