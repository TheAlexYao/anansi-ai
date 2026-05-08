'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

const HOME = os.homedir();

const PATHS = {
  HOME,
  ANANSI: path.join(HOME, 'anansi'),
  PROJECTS: path.join(HOME, 'anansi', 'projects'),
  WORKBENCH: path.join(HOME, 'anansi', 'workbench'),
  CLI: path.join(HOME, 'anansi', 'cli'),
  CONFIG: path.join(HOME, 'anansi', 'config.json'),
  PIDFILE: path.join(HOME, 'anansi', '.workbench.pid'),
  AGENTS_SKILLS: path.join(HOME, '.agents', 'skills'),
};

const DEFAULT_PORT = 3002;
const DEFAULT_PROJECT = 'hinter-pitch-film';
const REPO = 'TheAlexYao/anansi-ai';
const STARTER_BUNDLE_URL =
  `https://github.com/${REPO}/releases/latest/download/starter-bundle.zip`;

const SKILL_NAMES = [
  'anansi-brief',
  'anansi-mood-weaver',
  'anansi-story-weaver',
  'anansi-scene-weaver',
  'anansi-runway-render',
];

function step(label) {
  process.stdout.write(`  ${label}\n`);
}

function ok(label) {
  process.stdout.write(`  ✓ ${label}\n`);
}

function warn(label) {
  process.stdout.write(`  ⚠ ${label}\n`);
}

function fail(label) {
  process.stdout.write(`  ✗ ${label}\n`);
}

function header(label) {
  process.stdout.write(`\n${label}\n`);
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function readConfig() {
  if (!fs.existsSync(PATHS.CONFIG)) return {};
  try {
    return JSON.parse(fs.readFileSync(PATHS.CONFIG, 'utf8'));
  } catch {
    return {};
  }
}

function writeConfig(cfg) {
  ensureDir(PATHS.ANANSI);
  fs.writeFileSync(PATHS.CONFIG, JSON.stringify(cfg, null, 2) + '\n', { mode: 0o600 });
}

function which(bin) {
  const r = spawnSync('which', [bin], { encoding: 'utf8' });
  if (r.status !== 0) return null;
  return r.stdout.trim() || null;
}

function runQuiet(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', ...opts });
  return { code: r.status, stdout: r.stdout, stderr: r.stderr };
}

function runStream(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
  return r.status;
}

function spawnDetached(cmd, args, opts = {}) {
  const child = spawn(cmd, args, { detached: true, stdio: 'ignore', ...opts });
  child.unref();
  return child.pid;
}

function openInBrowser(url) {
  const platform = process.platform;
  const cmd = platform === 'darwin' ? 'open' : platform === 'win32' ? 'start' : 'xdg-open';
  runQuiet(cmd, [url]);
}

module.exports = {
  PATHS,
  DEFAULT_PORT,
  DEFAULT_PROJECT,
  REPO,
  STARTER_BUNDLE_URL,
  SKILL_NAMES,
  step,
  ok,
  warn,
  fail,
  header,
  ensureDir,
  readConfig,
  writeConfig,
  which,
  runQuiet,
  runStream,
  spawnDetached,
  openInBrowser,
};
