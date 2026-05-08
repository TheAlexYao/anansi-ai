'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { PATHS, DEFAULT_PORT, openInBrowser, writeConfig, readConfig } = require('./util');
const { startWorkbench } = require('./workbench');

async function open(args = []) {
  const slug = args[0];
  if (!slug) {
    console.error('Usage: anansi open <project-slug>');
    return 2;
  }

  const projectDir = path.join(PATHS.PROJECTS, slug);
  if (!fs.existsSync(projectDir)) {
    console.error(`Project not found: ${slug}`);
    console.error(`Available: ${fs.existsSync(PATHS.PROJECTS) ? fs.readdirSync(PATHS.PROJECTS).join(', ') : '(none)'}`);
    return 3;
  }

  // Persist as default so the workbench loads it on start.
  const cfg = readConfig();
  cfg.default_project = slug;
  writeConfig(cfg);

  const result = startWorkbench({ port: DEFAULT_PORT });
  const url = `http://localhost:${result.port || DEFAULT_PORT}`;
  openInBrowser(url);
  console.log(`Opening ${slug} at ${url}`);
}

module.exports = open;
