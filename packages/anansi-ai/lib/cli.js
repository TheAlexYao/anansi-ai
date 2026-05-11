"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const cp = require("child_process");

const PACKAGE_ROOT = path.resolve(__dirname, "..");
const TEXT_EXTENSIONS = new Set([
  ".md",
  ".txt",
  ".json",
  ".yaml",
  ".yml",
  ".sh",
  ".py",
  ".js",
  ".plist"
]);

function usage() {
  return `Anansi

Usage:
  npx anansi-ai connect [--vault PATH] [--force]
  anansi-ai doctor
  anansi-ai config get
  anansi-ai config set vault PATH
  anansi-ai config set runway_key KEY

Notes:
  - The Obsidian vault is never packaged or uploaded.
  - connect installs public agent files and stores only a local vault path.
`;
}

async function run(args) {
  const command = args[0] || "help";
  if (command === "help" || command === "--help" || command === "-h") {
    console.log(usage());
    return;
  }
  if (command === "connect") {
    return connect(parseOptions(args.slice(1)));
  }
  if (command === "doctor") {
    return doctor();
  }
  if (command === "config") {
    return configCommand(args.slice(1));
  }
  throw new Error(`Unknown command: ${command}\n\n${usage()}`);
}

function parseOptions(args) {
  const options = { force: false, dryRun: false };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--force") options.force = true;
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--vault") options.vaultPath = resolveHome(args[++i]);
    else if (arg === "--agent-home") options.agentHome = resolveHome(args[++i]);
    else if (arg === "--projects") options.projectsDir = resolveHome(args[++i]);
    else throw new Error(`Unknown option: ${arg}`);
  }
  return options;
}

function defaults(overrides = {}) {
  const home = os.homedir();
  const configDir = path.join(home, ".anansi");
  const agentHome = overrides.agentHome || path.join(home, "anansi", "agent");
  const projectsDir = overrides.projectsDir || path.join(home, "anansi", "projects");
  const hermesProfile = path.join(home, ".hermes", "profiles", "anansi");
  const vaultPath = overrides.vaultPath || detectVault(home) || null;
  return {
    home,
    configDir,
    configPath: path.join(configDir, "config.json"),
    agentHome,
    projectsDir,
    hermesProfile,
    vaultPath,
    skillsRoot: path.join(home, ".agents", "skills")
  };
}

function detectVault(home) {
  const candidates = [
    path.join(home, "Library", "Mobile Documents", "iCloud~md~obsidian", "Documents", "Anansi"),
    path.join(home, "Documents", "Anansi")
  ];
  return candidates.find((candidate) => fs.existsSync(candidate));
}

function loadConfig() {
  const paths = defaults();
  if (!fs.existsSync(paths.configPath)) return {};
  return JSON.parse(fs.readFileSync(paths.configPath, "utf8"));
}

function saveConfig(nextConfig) {
  const paths = defaults(nextConfig);
  fs.mkdirSync(paths.configDir, { recursive: true });
  fs.writeFileSync(paths.configPath, `${JSON.stringify(nextConfig, null, 2)}\n`);
  return paths.configPath;
}

function connect(options) {
  const priorConfig = loadConfig();
  const paths = defaults({ ...priorConfig, ...options });
  const config = {
    agentHome: paths.agentHome,
    projectsDir: paths.projectsDir,
    hermesProfile: paths.hermesProfile,
    vaultPath: paths.vaultPath,
    runwayKeyStorage: "macos-keychain:anansi-runway-api-key"
  };

  if (!paths.vaultPath) {
    console.log("No Anansi Obsidian vault detected. You can add it later:");
    console.log("  anansi-ai config set vault /absolute/path/to/Anansi");
  }

  if (!options.dryRun) saveConfig(config);
  fs.mkdirSync(paths.projectsDir, { recursive: true });
  fs.mkdirSync(paths.agentHome, { recursive: true });

  const replacements = {
    "{{ANANSI_USER_HOME}}": paths.home,
    "{{ANANSI_AGENT_HOME}}": paths.agentHome,
    "{{ANANSI_PROJECTS_DIR}}": paths.projectsDir,
    "{{ANANSI_HERMES_PROFILE}}": paths.hermesProfile,
    "{{ANANSI_VAULT_PATH}}": paths.vaultPath || path.join(paths.configDir, "set-vault-path"),
    "{{ANANSI_PUBLIC_REPO}}": "https://github.com/teambrukhman1/anansi-ai",
    "{{ANANSI_PRIVATE_REPO}}": "private-local-only"
  };

  copyTemplateDir(path.join(PACKAGE_ROOT, "bundle", "agents"), path.join(paths.agentHome, "agents"), replacements, options);
  copyTemplateDir(path.join(PACKAGE_ROOT, "bundle", "scripts"), path.join(paths.agentHome, "scripts"), replacements, options);
  copyTemplateDir(path.join(PACKAGE_ROOT, "bundle", "skills"), path.join(paths.agentHome, "skills"), replacements, options);
  copyTemplateDir(path.join(PACKAGE_ROOT, "bundle", "hermes-profile"), path.join(paths.agentHome, "hermes-profile"), replacements, options);

  fs.mkdirSync(paths.skillsRoot, { recursive: true });
  copyTemplateDir(path.join(PACKAGE_ROOT, "bundle", "agents"), paths.skillsRoot, replacements, options);
  copyTemplateDir(path.join(PACKAGE_ROOT, "bundle", "skills", "obsidian-vault"), path.join(paths.skillsRoot, "obsidian-vault"), replacements, options);

  copyTemplateDir(path.join(PACKAGE_ROOT, "bundle", "hermes-profile"), paths.hermesProfile, replacements, {
    ...options,
    backupExisting: true
  });

  chmodScripts(path.join(paths.agentHome, "scripts"));

  console.log("Anansi connected.");
  console.log(`Agent home: ${paths.agentHome}`);
  console.log(`Projects:   ${paths.projectsDir}`);
  console.log(`Skills:     ${paths.skillsRoot}`);
  console.log(`Hermes:     ${paths.hermesProfile}`);
  console.log(`Vault:      ${paths.vaultPath || "not set"}`);
  console.log("");
  console.log("Next:");
  console.log("  anansi-ai doctor");
}

function doctor() {
  const config = loadConfig();
  const paths = defaults(config);
  const checks = [
    ["config", paths.configPath],
    ["agent home", paths.agentHome],
    ["projects", paths.projectsDir],
    ["anansi-brief", path.join(paths.skillsRoot, "anansi-brief", "SKILL.md")],
    ["anansi-mood-weaver", path.join(paths.skillsRoot, "anansi-mood-weaver", "SKILL.md")],
    ["anansi-story-weaver", path.join(paths.skillsRoot, "anansi-story-weaver", "SKILL.md")],
    ["anansi-scene-weaver", path.join(paths.skillsRoot, "anansi-scene-weaver", "SKILL.md")],
    ["anansi-runway-render", path.join(paths.skillsRoot, "anansi-runway-render", "SKILL.md")],
    ["anansi-final-cut", path.join(paths.skillsRoot, "anansi-final-cut", "SKILL.md")],
    ["local vault path", paths.vaultPath || ""]
  ];
  for (const [label, filePath] of checks) {
    if (filePath && fs.existsSync(filePath)) console.log(`OK  ${label}`);
    else console.log(`NO  ${label}${filePath ? `: ${filePath}` : ""}`);
  }
}

function configCommand(args) {
  const action = args[0];
  if (action === "get") {
    console.log(JSON.stringify(loadConfig(), null, 2));
    return;
  }
  if (action !== "set") throw new Error(`Unknown config command.\n\n${usage()}`);
  const key = args[1];
  const value = args.slice(2).join(" ");
  if (!key || !value) throw new Error("Usage: anansi-ai config set <key> <value>");
  if (key === "vault") {
    const next = { ...loadConfig(), vaultPath: resolveHome(value) };
    const configPath = saveConfig(next);
    console.log(`Saved vault path in ${configPath}`);
    return;
  }
  if (key === "runway_key") {
    saveRunwayKey(value);
    return;
  }
  throw new Error(`Unsupported config key: ${key}`);
}

function saveRunwayKey(value) {
  if (process.platform !== "darwin") {
    throw new Error("runway_key storage currently uses macOS Keychain. Set RUNWAYML_API_SECRET in your private runtime environment on non-macOS systems.");
  }
  cp.execFileSync("security", [
    "add-generic-password",
    "-U",
    "-a",
    os.userInfo().username,
    "-s",
    "anansi-runway-api-key",
    "-w",
    value
  ], { stdio: "ignore" });
  console.log("Saved Runway key to macOS Keychain service anansi-runway-api-key.");
}

function copyTemplateDir(src, dest, replacements, options = {}) {
  if (!fs.existsSync(src)) return;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === ".DS_Store" || entry.name === ".env" || entry.name === "sessions") continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyTemplateDir(srcPath, destPath, replacements, options);
      continue;
    }
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    const data = fs.readFileSync(srcPath);
    const ext = path.extname(entry.name);
    const content = TEXT_EXTENSIONS.has(ext) ? applyReplacements(data.toString("utf8"), replacements) : data;
    if (options.backupExisting && fs.existsSync(destPath)) {
      const current = fs.readFileSync(destPath, TEXT_EXTENSIONS.has(ext) ? "utf8" : null);
      if (String(current) !== String(content)) {
        const stamp = new Date().toISOString().replace(/[:.]/g, "-");
        fs.copyFileSync(destPath, `${destPath}.bak-${stamp}`);
      }
    }
    fs.writeFileSync(destPath, content);
  }
}

function applyReplacements(content, replacements) {
  let next = content;
  for (const [token, value] of Object.entries(replacements)) {
    next = next.split(token).join(value);
  }
  return next;
}

function chmodScripts(dir) {
  if (!fs.existsSync(dir)) return;
  for (const file of walk(dir)) {
    if (file.endsWith(".sh") || file.endsWith(".py")) {
      fs.chmodSync(file, 0o755);
    }
  }
}

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(filePath);
    else yield filePath;
  }
}

function resolveHome(input) {
  if (!input) return input;
  if (input === "~") return os.homedir();
  if (input.startsWith("~/")) return path.join(os.homedir(), input.slice(2));
  return path.resolve(input);
}

module.exports = { run };
