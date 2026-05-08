'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { which, ok, warn, runStream, runQuiet, REPO } = require('./util');

// Three install strategies, tried in order:
//
//   1. Detect existing binary on PATH — done.
//   2. `printing-press install runway --cli-only` — works if the user has
//      access to the catalog entry (Matt's printing-press-library).
//   3. Download a pre-built binary from anansi-ai's GitHub release — the
//      production path once we ship binaries with each release.
//
// Each step is idempotent and degrades gracefully. A final manual-install
// hint is printed if all three fail.

const PRINTING_PRESS_NPM = '@mvanhorn/printing-press';
const RUNWAY_GO_MODULE =
  'github.com/mvanhorn/printing-press-library/library/other/runway/cmd/runway-pp-cli@latest';
const ANANSI_RELEASE_BASE =
  `https://github.com/${REPO}/releases/latest/download`;

function platformBinaryName() {
  const platform = process.platform; // 'darwin' | 'linux' | 'win32'
  const arch = process.arch; // 'arm64' | 'x64'
  const archMap = { x64: 'amd64', arm64: 'arm64' };
  const platMap = { darwin: 'darwin', linux: 'linux', win32: 'windows' };
  const p = platMap[platform];
  const a = archMap[arch];
  if (!p || !a) return null;
  const ext = platform === 'win32' ? '.exe' : '';
  return `runway-pp-cli-${p}-${a}${ext}`;
}

function installBinDir() {
  // Prefer GOPATH/bin if Go is around; fall back to ~/.local/bin.
  const goEnv = runQuiet('go', ['env', 'GOPATH']);
  if (goEnv.code === 0 && goEnv.stdout.trim()) {
    return path.join(goEnv.stdout.trim(), 'bin');
  }
  return path.join(os.homedir(), '.local', 'bin');
}

function installRunwayPpCli({ force = false } = {}) {
  // 1. Already installed?
  const existing = which('runway-pp-cli');
  if (existing && !force) {
    ok(`runway-pp-cli already installed at ${existing}`);
    return { installed: true, path: existing, source: 'existing', skipped: true };
  }

  // 2. Try Printing Press.
  const ppLocal = which('printing-press');
  if (ppLocal) {
    const r = runStream('printing-press', ['install', 'runway', '--cli-only', '--yes']);
    if (r === 0 && which('runway-pp-cli')) {
      ok('runway-pp-cli installed via printing-press');
      return { installed: true, path: which('runway-pp-cli'), source: 'printing-press' };
    }
  } else {
    const r = runStream('npx', ['-y', PRINTING_PRESS_NPM, 'install', 'runway', '--cli-only', '--yes']);
    if (r === 0 && which('runway-pp-cli')) {
      ok('runway-pp-cli installed via npx printing-press');
      return { installed: true, path: which('runway-pp-cli'), source: 'printing-press' };
    }
  }

  warn('Printing Press install path did not yield runway-pp-cli — likely the runway entry is not in the active catalog.');

  // 3. Try our own GitHub release.
  const binName = platformBinaryName();
  if (binName && which('curl')) {
    const url = `${ANANSI_RELEASE_BASE}/${binName}`;
    const dest = path.join(installBinDir(), 'runway-pp-cli' + (process.platform === 'win32' ? '.exe' : ''));
    fs.mkdirSync(path.dirname(dest), { recursive: true });

    warn(`Trying anansi-ai GitHub release: ${url}`);
    const dl = runStream('curl', ['-fsSL', '-o', dest, url]);
    if (dl === 0 && fs.existsSync(dest)) {
      try {
        fs.chmodSync(dest, 0o755);
        if (process.platform === 'darwin') {
          // Clear quarantine attribute so macOS lets the binary run unsigned.
          spawnSync('xattr', ['-d', 'com.apple.quarantine', dest], { stdio: 'ignore' });
        }
      } catch {
        /* best effort */
      }
      ok(`runway-pp-cli downloaded from anansi-ai release to ${dest}`);
      ok(`Add ${path.dirname(dest)} to your PATH if it isn't already.`);
      return { installed: true, path: dest, source: 'anansi-release' };
    }
  }

  // 4. Manual fallback.
  warn('runway-pp-cli could not be installed automatically.');
  warn('');
  warn('Install one of these ways:');
  warn(`  1. Printing Press CLI:  printing-press install runway --cli-only`);
  warn(`  2. From source (Go 1.23+):  go install ${RUNWAY_GO_MODULE}`);
  warn(`  3. Pre-built binary:    https://github.com/${REPO}/releases/latest`);
  warn('');
  warn('Then re-run `anansi connect` (it will detect the installed binary).');

  return { installed: false, path: null, source: 'none' };
}

module.exports = { installRunwayPpCli };
