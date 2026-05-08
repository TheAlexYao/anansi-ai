'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { PATHS, SKILL_NAMES, ensureDir, ok, warn } = require('./util');

// The installer ships skill source under installer/../agent/skills/<name>/.
// At runtime we resolve relative to this file (lib/) up to the package root.
const SKILL_SOURCE = path.resolve(__dirname, '..', '..', 'agent', 'skills');

function skillSourcePath(skill) {
  return path.join(SKILL_SOURCE, skill);
}

function ensureSymlink(src, dst) {
  if (!fs.existsSync(src)) return false;

  // If destination exists and points to the right place, leave it.
  try {
    const stat = fs.lstatSync(dst);
    if (stat.isSymbolicLink()) {
      const current = fs.readlinkSync(dst);
      if (path.resolve(path.dirname(dst), current) === path.resolve(src)) return true;
      fs.unlinkSync(dst);
    } else if (stat.isDirectory() || stat.isFile()) {
      // Don't clobber a real file/dir — leave it and report.
      return false;
    }
  } catch {
    // Doesn't exist; we'll create it.
  }

  try {
    fs.symlinkSync(src, dst, 'dir');
    return true;
  } catch (err) {
    if (err.code === 'EEXIST') return true;
    throw err;
  }
}

// Install: symlink each skill into ~/.agents/skills/anansi-<name>/, then
// fan out symlinks into each detected runtime's skills directory.
function installSkills(detectedRuntimes) {
  ensureDir(PATHS.AGENTS_SKILLS);
  const installed = [];
  const missing = [];

  for (const skill of SKILL_NAMES) {
    const src = skillSourcePath(skill);
    if (!fs.existsSync(src)) {
      missing.push(skill);
      continue;
    }

    const universalDst = path.join(PATHS.AGENTS_SKILLS, skill);
    ensureSymlink(src, universalDst);

    for (const runtime of detectedRuntimes) {
      ensureDir(runtime.skillsPath);
      const runtimeDst = path.join(runtime.skillsPath, skill);
      ensureSymlink(universalDst, runtimeDst);
    }

    installed.push(skill);
  }

  if (installed.length) {
    ok(`Installed ${installed.length} Anansi skills to ~/.agents/skills/`);
  }
  if (missing.length) {
    warn(`Skill source not found for: ${missing.join(', ')}`);
  }

  return { installed, missing };
}

// Remove our symlinks. Doesn't touch the source. Doesn't clobber files
// that aren't our symlinks.
function uninstallSkills(detectedRuntimes) {
  const removed = [];
  const targets = [
    PATHS.AGENTS_SKILLS,
    ...detectedRuntimes.map((r) => r.skillsPath),
  ];

  for (const dir of targets) {
    for (const skill of SKILL_NAMES) {
      const dst = path.join(dir, skill);
      try {
        const stat = fs.lstatSync(dst);
        if (stat.isSymbolicLink()) {
          fs.unlinkSync(dst);
          removed.push(dst);
        }
      } catch {
        // not present, skip
      }
    }
  }

  return removed;
}

module.exports = { installSkills, uninstallSkills, skillSourcePath, SKILL_SOURCE };
