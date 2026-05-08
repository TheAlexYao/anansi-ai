'use strict';

// `anansi connect` — the install moment.
//
// Reads as a script, top to bottom:
//   1. Detect agent runtimes.
//   2. Symlink five Anansi skills into ~/.agents/skills/ (and runtime dirs).
//   3. Install runway-pp-cli via Printing Press (Go fallback).
//   4. Fetch the starter project bundle.
//   5. Clone + install the workbench.
//   6. Start the workbench in the background.
//   7. Open the browser.

const { detectRuntimes } = require('./runtimes');
const { installSkills } = require('./skills');
const { installRunwayPpCli } = require('./runway-pp');
const { fetchStarterBundle } = require('./bundle');
const { installWorkbench, startWorkbench } = require('./workbench');
const {
  ensureDir,
  PATHS,
  DEFAULT_PORT,
  DEFAULT_PROJECT,
  header,
  ok,
  warn,
  step,
  openInBrowser,
} = require('./util');

async function connect(args = []) {
  const noOpen = args.includes('--no-open');
  const noStart = args.includes('--no-start');
  const force = args.includes('--force');

  banner();
  ensureDir(PATHS.ANANSI);

  // 1. Detect agent runtimes.
  header('1. Detecting agent runtimes');
  const runtimes = detectRuntimes();
  if (runtimes.length === 0) {
    warn('No agent runtimes detected. Skills will install to ~/.agents/skills/ only.');
  } else {
    ok(`Detected: ${runtimes.map((r) => r.name).join(', ')}`);
  }

  // 2. Install Anansi skills.
  header('2. Installing Anansi skills');
  installSkills(runtimes);

  // 3. Install runway-pp-cli.
  header('3. Installing runway-pp-cli (Runway API CLI from OpenAPI spec)');
  installRunwayPpCli({ force });

  // 4. Starter project.
  header('4. Fetching starter project');
  fetchStarterBundle({ force });

  // 5. Workbench source.
  header('5. Installing workbench');
  installWorkbench({ force });

  // 6. Start workbench.
  if (!noStart) {
    header('6. Starting workbench');
    const result = startWorkbench({ port: DEFAULT_PORT });
    if (result.started || result.skipped) {
      const url = `http://localhost:${result.port || DEFAULT_PORT}`;
      if (!noOpen) {
        step(`Opening ${url}`);
        openInBrowser(url);
      } else {
        step(`Open ${url} when ready`);
      }
    }
  }

  // Final word.
  console.log(`
🕷  Anansi connected.

  • Skills:    ~/.agents/skills/anansi-*  (linked into your runtimes)
  • Workbench: http://localhost:${DEFAULT_PORT}
  • Projects:  ~/anansi/projects/
  • Starter:   ${DEFAULT_PROJECT}

Next:
  - Open the workbench and click through the starter project.
  - Bring your own Runway key:  export RUNWAYML_API_KEY_AUTH=rw_...
  - Generate a new film:        anansi run path/to/brief.md
  - Verify install:             anansi doctor
`);
}

function banner() {
  console.log(`
   ╭───────────────────────────────────────────────╮
   │   ANANSI                                      │
   │   the visual storytelling agent for Runway    │
   ╰───────────────────────────────────────────────╯
`);
}

module.exports = connect;
