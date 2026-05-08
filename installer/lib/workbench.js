'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const {
  PATHS,
  REPO,
  DEFAULT_PORT,
  ensureDir,
  ok,
  warn,
  which,
  spawnDetached,
  readConfig,
} = require('./util');

// Install the workbench into ~/anansi/workbench/. Strategy:
//   1. If ~/anansi/workbench already exists, skip.
//   2. Otherwise, clone the public repo there.
// In a packaged future we'd ship the built workbench in the npm tarball
// and copy it. For now, git clone is deterministic and small enough.
function installWorkbench({ force = false } = {}) {
  if (fs.existsSync(PATHS.WORKBENCH) && !force) {
    ok(`Workbench already at ~/anansi/workbench`);
    return { installed: false, skipped: true };
  }

  if (force && fs.existsSync(PATHS.WORKBENCH)) {
    fs.rmSync(PATHS.WORKBENCH, { recursive: true, force: true });
  }

  if (!which('git')) {
    warn('git not found; cannot install workbench. Install git and re-run.');
    return { installed: false, skipped: false };
  }

  ensureDir(PATHS.ANANSI);
  const clone = spawnSync('git', ['clone', '--depth', '1', `https://github.com/${REPO}.git`, PATHS.WORKBENCH], {
    stdio: 'inherit',
  });
  if (clone.status !== 0) {
    warn('Workbench clone failed.');
    return { installed: false, skipped: false };
  }

  // Install workbench dependencies. Prefer bun if present (faster); fall back to npm.
  const installer = which('bun') ? 'bun' : 'npm';
  const installArgs = installer === 'bun' ? ['install'] : ['install', '--no-audit', '--no-fund'];
  const inst = spawnSync(installer, installArgs, { cwd: PATHS.WORKBENCH, stdio: 'inherit' });
  if (inst.status !== 0) {
    warn(`Workbench dependency install failed (${installer}).`);
    return { installed: false, skipped: false };
  }

  ok(`Workbench installed at ~/anansi/workbench (deps via ${installer})`);
  return { installed: true, skipped: false };
}

// Start the workbench in the background. Writes PID to ~/anansi/.workbench.pid
// so disconnect / restart can find it.
function startWorkbench({ port = DEFAULT_PORT } = {}) {
  if (!fs.existsSync(PATHS.WORKBENCH)) {
    warn('Workbench not installed; skipping start.');
    return { started: false };
  }

  // If a PID file exists and the process is alive, don't double-start.
  if (fs.existsSync(PATHS.PIDFILE)) {
    const existing = parseInt(fs.readFileSync(PATHS.PIDFILE, 'utf8'), 10);
    if (existing && processAlive(existing)) {
      ok(`Workbench already running (pid ${existing})`);
      return { started: false, pid: existing, skipped: true };
    }
  }

  const cfg = readConfig();
  const runner = which('bun') ? 'bun' : 'npm';
  const args = runner === 'bun' ? ['run', 'dev', '--', '-p', String(port)] : ['run', 'dev', '--', '-p', String(port)];
  const env = {
    ...process.env,
    PORT: String(port),
    ANANSI_DEFAULT_PROJECT: cfg.default_project || 'hinter-pitch-film',
  };

  const pid = spawnDetached(runner, args, { cwd: PATHS.WORKBENCH, env });
  fs.writeFileSync(PATHS.PIDFILE, String(pid));
  ok(`Workbench starting at http://localhost:${port} (pid ${pid})`);
  return { started: true, pid, port };
}

function stopWorkbench() {
  if (!fs.existsSync(PATHS.PIDFILE)) return { stopped: false, reason: 'no pidfile' };
  const pid = parseInt(fs.readFileSync(PATHS.PIDFILE, 'utf8'), 10);
  if (!pid || !processAlive(pid)) {
    fs.rmSync(PATHS.PIDFILE, { force: true });
    return { stopped: false, reason: 'not running' };
  }
  try {
    process.kill(pid, 'SIGTERM');
  } catch {
    // ignore
  }
  fs.rmSync(PATHS.PIDFILE, { force: true });
  return { stopped: true, pid };
}

function processAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

module.exports = { installWorkbench, startWorkbench, stopWorkbench };
