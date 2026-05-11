#!/usr/bin/env bash
set -euo pipefail

PATH="/opt/homebrew/bin:/usr/local/bin:{{ANANSI_USER_HOME}}/.nvm/versions/node/v22.0.0/bin:{{ANANSI_USER_HOME}}/.nvm/versions/node/v22.1.0/bin:{{ANANSI_USER_HOME}}/.nvm/versions/node/v22.2.0/bin:{{ANANSI_USER_HOME}}/.nvm/versions/node/v22.3.0/bin:{{ANANSI_USER_HOME}}/.nvm/versions/node/v22.4.0/bin:{{ANANSI_USER_HOME}}/.nvm/versions/node/v22.5.0/bin:{{ANANSI_USER_HOME}}/.nvm/versions/node/v22.6.0/bin:{{ANANSI_USER_HOME}}/.nvm/versions/node/v22.7.0/bin:{{ANANSI_USER_HOME}}/.nvm/versions/node/v22.8.0/bin:{{ANANSI_USER_HOME}}/.nvm/versions/node/v22.9.0/bin:{{ANANSI_USER_HOME}}/.nvm/versions/node/v22.10.0/bin:{{ANANSI_USER_HOME}}/.nvm/versions/node/v22.11.0/bin:{{ANANSI_USER_HOME}}/.nvm/versions/node/v22.12.0/bin:$PATH"

echo "Checking HyperFrames setup..."
echo

node_major() {
  node --version 2>/dev/null | sed -E 's/^v([0-9]+).*/\1/'
}

if command -v node >/dev/null 2>&1; then
  NODE_VERSION="$(node --version)"
  NODE_MAJOR="$(node_major)"
  if [[ "$NODE_MAJOR" =~ ^[0-9]+$ && "$NODE_MAJOR" -ge 22 ]]; then
    echo "OK  Node.js $NODE_VERSION"
  else
    echo "NO  Node.js $NODE_VERSION found, but HyperFrames requires Node.js 22+"
    echo "    Install Node 22+ or make it available on PATH before rendering HyperFrames compositions."
  fi
else
  echo "NO  Node.js not found"
  echo "    HyperFrames requires Node.js 22+."
fi

if command -v npm >/dev/null 2>&1; then
  echo "OK  npm $(npm --version)"
else
  echo "NO  npm not found"
fi

if command -v npx >/dev/null 2>&1; then
  echo "OK  npx available"
else
  echo "NO  npx not found"
fi

if command -v ffmpeg >/dev/null 2>&1; then
  echo "OK  ffmpeg installed"
else
  echo "NO  ffmpeg not found"
  echo "    HyperFrames uses ffmpeg for MP4 rendering."
fi

echo
echo "Optional skill install for agent authoring:"
echo "  npx skills add heygen-com/hyperframes"
echo
echo "Manual HyperFrames commands:"
echo "  npx hyperframes init my-video --non-interactive --example blank"
echo "  npx hyperframes preview"
echo "  npx hyperframes render --output output.mp4"
