#!/usr/bin/env node
"use strict";

const { run } = require("../lib/cli");

run(process.argv.slice(2)).catch((error) => {
  console.error(`Anansi error: ${error.message}`);
  process.exit(1);
});
