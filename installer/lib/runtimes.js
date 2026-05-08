'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { PATHS, which } = require('./util');

// Each runtime: where it stores skills, and how to detect its presence.
// Universal target is ~/.agents/skills/ which is the convention shared by
// the `skills` installer (npx skills add ...). Detected runtimes get an
// additional symlink into their own skills directory for runtimes that
// don't read from the universal path.
const RUNTIMES = [
  {
    name: 'Claude Code',
    detect: () => fs.existsSync(path.join(PATHS.HOME, '.claude')),
    skillsPath: path.join(PATHS.HOME, '.claude', 'skills'),
  },
  {
    name: 'Hermes',
    detect: () =>
      fs.existsSync(path.join(PATHS.HOME, '.hermes', 'config.yaml')) ||
      fs.existsSync(path.join(PATHS.HOME, '.hermes')),
    skillsPath: path.join(PATHS.HOME, '.hermes', 'skills'),
  },
  {
    name: 'OpenClaw',
    detect: () => fs.existsSync(path.join(PATHS.HOME, '.openclaw')),
    skillsPath: path.join(PATHS.HOME, '.openclaw', 'skills'),
  },
  {
    name: 'Codex',
    detect: () =>
      fs.existsSync(path.join(PATHS.HOME, '.codex')) || which('codex') !== null,
    skillsPath: path.join(PATHS.HOME, '.codex', 'skills'),
  },
];

function detectRuntimes() {
  return RUNTIMES.filter((r) => {
    try {
      return r.detect();
    } catch {
      return false;
    }
  });
}

module.exports = { RUNTIMES, detectRuntimes };
