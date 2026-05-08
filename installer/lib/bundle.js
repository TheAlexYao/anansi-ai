'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const {
  PATHS,
  DEFAULT_PROJECT,
  STARTER_BUNDLE_URL,
  ensureDir,
  ok,
  warn,
  which,
} = require('./util');

// Download the starter project bundle from the latest GitHub release and
// extract into ~/anansi/projects/. Skips if the default project already
// exists (idempotent).
function fetchStarterBundle({ force = false } = {}) {
  ensureDir(PATHS.PROJECTS);
  const dest = path.join(PATHS.PROJECTS, DEFAULT_PROJECT);

  if (fs.existsSync(dest) && !force) {
    ok(`Starter project already present at ~/anansi/projects/${DEFAULT_PROJECT}`);
    return { downloaded: false, project: dest, skipped: true };
  }

  const tmp = path.join(os.tmpdir(), `anansi-starter-${Date.now()}.zip`);

  if (!which('curl')) {
    warn('curl not found; skipping starter bundle download.');
    return { downloaded: false, project: null, skipped: false };
  }

  const dl = spawnSync('curl', ['-fsSL', '-o', tmp, STARTER_BUNDLE_URL], { stdio: 'inherit' });
  if (dl.status !== 0) {
    warn(`Starter bundle download failed (release may not be published yet).`);
    warn(`URL: ${STARTER_BUNDLE_URL}`);
    // Create an empty project skeleton so the workbench has somewhere to point.
    ensureDir(dest);
    fs.writeFileSync(
      path.join(dest, 'project.json'),
      JSON.stringify(emptyProject(DEFAULT_PROJECT), null, 2) + '\n',
    );
    warn(`Created empty placeholder project at ${dest}`);
    return { downloaded: false, project: dest, skipped: false, placeholder: true };
  }

  if (!which('unzip')) {
    warn('unzip not found; downloaded bundle to ' + tmp);
    return { downloaded: false, project: null, skipped: false };
  }

  const ex = spawnSync('unzip', ['-q', '-o', tmp, '-d', PATHS.PROJECTS], { stdio: 'inherit' });
  fs.rmSync(tmp, { force: true });

  if (ex.status !== 0) {
    warn('Starter bundle extraction failed.');
    return { downloaded: false, project: null, skipped: false };
  }

  ok(`Starter project extracted to ~/anansi/projects/${DEFAULT_PROJECT}`);
  return { downloaded: true, project: dest, skipped: false };
}

function emptyProject(slug) {
  return {
    id: slug,
    created_at: new Date().toISOString(),
    format: '16:9',
    duration_seconds: 30,
    brief: { product: '', audience: '', feeling: '', references: [] },
    mood: { palette: [], references: [], lighting: '', camera_language: '' },
    directions: [],
    scenes: [],
    final: null,
    _placeholder: true,
  };
}

module.exports = { fetchStarterBundle };
