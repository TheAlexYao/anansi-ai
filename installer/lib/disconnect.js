'use strict';

const fs = require('node:fs');
const { detectRuntimes } = require('./runtimes');
const { uninstallSkills } = require('./skills');
const { stopWorkbench } = require('./workbench');
const { PATHS, header, ok, warn } = require('./util');

async function disconnect(args = []) {
  const purge = args.includes('--purge');

  header('Disconnecting Anansi');

  const stopResult = stopWorkbench();
  if (stopResult.stopped) ok(`Stopped workbench (pid ${stopResult.pid})`);

  const runtimes = detectRuntimes();
  const removed = uninstallSkills(runtimes);
  ok(`Removed ${removed.length} skill symlinks`);

  if (fs.existsSync(PATHS.WORKBENCH)) {
    fs.rmSync(PATHS.WORKBENCH, { recursive: true, force: true });
    ok('Removed workbench at ~/anansi/workbench');
  }

  if (purge && fs.existsSync(PATHS.ANANSI)) {
    fs.rmSync(PATHS.ANANSI, { recursive: true, force: true });
    warn('Purged ~/anansi/ including projects.');
  } else if (fs.existsSync(PATHS.PROJECTS)) {
    ok('Kept your projects at ~/anansi/projects/ (use --purge to remove)');
  }

  console.log('\nAnansi disconnected. runway-pp-cli was left in place.');
}

module.exports = disconnect;
