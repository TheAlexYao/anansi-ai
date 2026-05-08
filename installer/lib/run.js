'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { header, warn, ok } = require('./util');

// Stub for the headless workflow runner. The real implementation invokes
// the five Anansi skills in order and writes a project.json. For now we
// validate inputs and write a placeholder so the pipeline shape is testable.
async function run(args = []) {
  const briefPath = args[0];
  if (!briefPath) {
    console.error('Usage: anansi run <brief.md>');
    return 2;
  }

  const resolved = path.resolve(briefPath);
  if (!fs.existsSync(resolved)) {
    console.error(`Brief not found: ${resolved}`);
    return 3;
  }

  header(`Running Anansi workflow on ${resolved}`);
  warn('Headless runner not yet implemented.');
  warn('For now, open the workbench and paste the brief there:');
  console.log(`  cat ${resolved}`);
  console.log(`  open http://localhost:3002`);
  ok('Brief is valid and ready to ingest.');
}

module.exports = run;
