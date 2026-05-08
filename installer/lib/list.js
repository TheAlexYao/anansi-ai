'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { PATHS } = require('./util');

async function list() {
  if (!fs.existsSync(PATHS.PROJECTS)) {
    console.log('No projects yet. Run `anansi connect` to install the starter.');
    return;
  }

  const slugs = fs.readdirSync(PATHS.PROJECTS, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  if (slugs.length === 0) {
    console.log('No projects yet.');
    return;
  }

  console.log(`Projects in ~/anansi/projects/:\n`);
  for (const slug of slugs) {
    const projectFile = path.join(PATHS.PROJECTS, slug, 'project.json');
    let summary = '';
    try {
      const p = JSON.parse(fs.readFileSync(projectFile, 'utf8'));
      const brief = (p.brief && p.brief.product) || '(no brief)';
      const fmt = p.format || '?';
      const dur = p.duration_seconds ? `${p.duration_seconds}s` : '?';
      summary = `  ${fmt} · ${dur} · ${brief}`;
    } catch {
      summary = '  (no project.json)';
    }
    console.log(`• ${slug}\n${summary}\n`);
  }
}

module.exports = list;
