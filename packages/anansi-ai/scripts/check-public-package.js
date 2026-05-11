#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const forbiddenPathFragments = [
  ".env",
  ".DS_Store",
  `${path.sep}.obsidian${path.sep}`,
  `${path.sep}00 Inbox${path.sep}`,
  `${path.sep}06 Client Briefs${path.sep}`,
  `${path.sep}08 Demo Projects${path.sep}`,
  `${path.sep}09 Asset Index${path.sep}`,
  `${path.sep}12 Violeta Creative Director${path.sep}`,
  `${path.sep}22 Client Style Memory${path.sep}`,
  `${path.sep}meeting-extracts${path.sep}`,
  `${path.sep}sessions${path.sep}`,
  `${path.sep}vault${path.sep}`,
  `${path.sep}anansi-agent-vault${path.sep}`,
  `${path.sep}anansi-obsidian-vault${path.sep}`,
  `${path.sep}anansi-agent-operating-system${path.sep}`,
  `${path.sep}Obsidian${path.sep}`
];

const forbiddenContent = [
  /\/Users\/(sambrukhman|alexyao)\//i,
  /iCloud~md~obsidian\/Documents\/Anansi/i,
  /com~apple~CloudDocs\/Anansi Agent/i,
  /anansi-creative-system-private/i,
  /client style memory/i,
  /meeting extracts/i,
  /private obsidian vault/i,
  /violeta/i,
  /\bsk-[A-Za-z0-9_-]{20,}/,
  /\brw_[A-Za-z0-9_-]{20,}/,
  /\bkey_[A-Za-z0-9]{20,}/,
  /BEGIN (RSA |EC |OPENSSH |)PRIVATE KEY/
];

const allowedDirs = new Set([".git", "node_modules"]);
const textExtensions = new Set([".md", ".txt", ".json", ".yaml", ".yml", ".sh", ".py", ".js", ".plist"]);
const failures = [];

for (const file of walk(root)) {
  const relative = path.relative(root, file);
  if (relative === "scripts/check-public-package.js") continue;
  if (forbiddenPathFragments.some((fragment) => file.includes(fragment))) {
    failures.push(`forbidden path: ${relative}`);
    continue;
  }
  if (!textExtensions.has(path.extname(file))) continue;
  const content = fs.readFileSync(file, "utf8");
  for (const pattern of forbiddenContent) {
    if (pattern.test(content)) {
      failures.push(`forbidden content ${pattern} in ${relative}`);
    }
  }
}

if (failures.length) {
  console.error("Public package check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Public package check passed.");

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (allowedDirs.has(entry.name)) continue;
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(filePath);
    else yield filePath;
  }
}
