#!/usr/bin/env node
// anansi — entry point. Parses subcommand and dispatches to lib/.

'use strict';

const path = require('node:path');
const pkg = require('../package.json');

const COMMANDS = {
  connect: require('../lib/connect'),
  disconnect: require('../lib/disconnect'),
  update: require('../lib/update'),
  pull: require('../lib/pull'),
  run: require('../lib/run'),
  list: require('../lib/list'),
  open: require('../lib/open'),
  config: require('../lib/config'),
  doctor: require('../lib/doctor'),
};

const argv = process.argv.slice(2);
const cmd = argv[0];
const rest = argv.slice(1);

if (cmd === '--version' || cmd === '-v') {
  console.log(`anansi ${pkg.version}`);
  process.exit(0);
}

if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') {
  printHelp();
  process.exit(cmd ? 0 : 2);
}

const handler = COMMANDS[cmd];
if (!handler) {
  console.error(`anansi: unknown command "${cmd}"`);
  printHelp();
  process.exit(2);
}

Promise.resolve()
  .then(() => handler(rest))
  .then((code) => process.exit(typeof code === 'number' ? code : 0))
  .catch((err) => {
    console.error(`\nanansi: ${err.message || err}`);
    if (process.env.ANANSI_DEBUG) console.error(err.stack);
    process.exit(1);
  });

function printHelp() {
  console.log(`anansi ${pkg.version} — visual storytelling agent for Runway

Usage:  anansi <command> [args]

Commands:
  connect       Install Anansi skills, runway-pp-cli, and the workbench.
                Starts the workbench at http://localhost:3002.
  disconnect    Remove skills, workbench, and CLI. Projects are kept.
  update        Update skills, workbench, and starter bundle.
  pull          Re-download the starter project bundle.
  run <brief>   Run the workflow on a brief file (writes to ~/anansi/projects).
  list          List installed projects.
  open <slug>   Open a project in the workbench.
  config <k> <v>  Get/set config values (e.g. runwayml_api_key).
  doctor        Verify install: runtimes, skills, runway-pp-cli, workbench.

Flags:
  --version, -v   Print version
  --help, -h      This message

Docs:    https://github.com/TheAlexYao/anansi-ai
Install: npx anansi connect
`);
}
