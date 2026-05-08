'use strict';

const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const { PATHS, header, ok, warn, which } = require('./util');
const { fetchStarterBundle } = require('./bundle');
const { installRunwayPpCli } = require('./runway-pp');

async function update() {
  header('Updating Anansi');

  if (fs.existsSync(PATHS.WORKBENCH) && which('git')) {
    const r = spawnSync('git', ['pull', '--ff-only'], { cwd: PATHS.WORKBENCH, stdio: 'inherit' });
    if (r.status === 0) ok('Workbench updated (git pull --ff-only)');
    else warn('Workbench git pull failed.');
  }

  installRunwayPpCli({ force: true });
  fetchStarterBundle({ force: true });

  console.log('\nUpdate complete. Restart the workbench to pick up changes:');
  console.log('  anansi disconnect && anansi connect');
}

module.exports = update;
