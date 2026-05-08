'use strict';

const { readConfig, writeConfig } = require('./util');

const SENSITIVE = new Set(['runwayml_api_key', 'elevenlabs_key', 'suno_key', 'openai_key']);

async function config(args = []) {
  const [verb, key, ...rest] = args;
  const cfg = readConfig();

  if (!verb || verb === 'list') {
    const keys = Object.keys(cfg);
    if (keys.length === 0) {
      console.log('No config set.');
      return;
    }
    for (const k of keys) {
      console.log(`${k} = ${SENSITIVE.has(k) ? maskValue(cfg[k]) : cfg[k]}`);
    }
    return;
  }

  if (verb === 'get') {
    if (!key) {
      console.error('Usage: anansi config get <key>');
      return 2;
    }
    const v = cfg[key];
    if (v == null) {
      console.error(`config key not set: ${key}`);
      return 3;
    }
    console.log(SENSITIVE.has(key) ? maskValue(v) : v);
    return;
  }

  if (verb === 'set') {
    if (!key || rest.length === 0) {
      console.error('Usage: anansi config set <key> <value>');
      return 2;
    }
    cfg[key] = rest.join(' ');
    writeConfig(cfg);
    console.log(`set ${key} = ${SENSITIVE.has(key) ? maskValue(cfg[key]) : cfg[key]}`);
    return;
  }

  if (verb === 'unset' || verb === 'delete' || verb === 'rm') {
    if (!key) {
      console.error('Usage: anansi config unset <key>');
      return 2;
    }
    delete cfg[key];
    writeConfig(cfg);
    console.log(`unset ${key}`);
    return;
  }

  console.error(`Unknown verb: ${verb}`);
  console.error('Usage: anansi config [list|get|set|unset] <key> [value]');
  return 2;
}

function maskValue(v) {
  if (typeof v !== 'string' || v.length <= 6) return '***';
  return `${v.slice(0, 4)}…${v.slice(-2)}`;
}

module.exports = config;
