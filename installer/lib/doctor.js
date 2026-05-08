'use strict';

const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const { PATHS, SKILL_NAMES, header, ok, warn, fail, which } = require('./util');
const { detectRuntimes } = require('./runtimes');

async function doctor() {
  header('Anansi doctor');

  // 1. Skills.
  let installedCount = 0;
  for (const skill of SKILL_NAMES) {
    if (fs.existsSync(`${PATHS.AGENTS_SKILLS}/${skill}`)) installedCount++;
  }
  if (installedCount === SKILL_NAMES.length) ok(`Skills: ${installedCount}/${SKILL_NAMES.length} installed`);
  else if (installedCount > 0) warn(`Skills: ${installedCount}/${SKILL_NAMES.length} installed (run \`anansi connect\`)`);
  else fail(`Skills: 0/${SKILL_NAMES.length} installed`);

  // 2. runway-pp-cli.
  const ppCli = which('runway-pp-cli');
  if (ppCli) {
    ok(`runway-pp-cli at ${ppCli}`);
    const ver = spawnSync('runway-pp-cli', ['--version'], { encoding: 'utf8' });
    if (ver.status === 0) ok(`  version: ${ver.stdout.trim()}`);
  } else {
    fail('runway-pp-cli not on PATH');
  }

  // 3. Auth.
  const hasEnv = !!process.env.RUNWAYML_API_KEY_AUTH;
  if (hasEnv) {
    ok('RUNWAYML_API_KEY_AUTH is set in environment');
    if (ppCli) {
      const docResult = spawnSync('runway-pp-cli', ['doctor'], { encoding: 'utf8' });
      if (docResult.status === 0) ok('  runway-pp-cli doctor passed');
      else warn('  runway-pp-cli doctor reported issues — run it directly for details');
    }
  } else {
    warn('RUNWAYML_API_KEY_AUTH not set (only required for new generation)');
  }

  // 4. Workbench.
  if (fs.existsSync(PATHS.WORKBENCH)) ok(`Workbench at ${PATHS.WORKBENCH}`);
  else fail('Workbench not installed');

  if (fs.existsSync(PATHS.PIDFILE)) {
    const pid = parseInt(fs.readFileSync(PATHS.PIDFILE, 'utf8'), 10);
    let alive = false;
    try {
      process.kill(pid, 0);
      alive = true;
    } catch {
      // not alive
    }
    if (alive) ok(`Workbench running (pid ${pid})`);
    else warn(`Workbench pidfile present but process not alive (pid ${pid})`);
  } else {
    warn('Workbench not running');
  }

  // 5. Runtimes.
  const runtimes = detectRuntimes();
  if (runtimes.length) ok(`Runtimes detected: ${runtimes.map((r) => r.name).join(', ')}`);
  else warn('No agent runtimes detected (Claude Code / Hermes / OpenClaw / Codex)');

  // 6. Projects.
  if (fs.existsSync(PATHS.PROJECTS)) {
    const slugs = fs.readdirSync(PATHS.PROJECTS, { withFileTypes: true })
      .filter((d) => d.isDirectory()).map((d) => d.name);
    ok(`Projects: ${slugs.length} (${slugs.join(', ') || 'none'})`);
  } else {
    warn('No projects directory yet');
  }
}

module.exports = doctor;
