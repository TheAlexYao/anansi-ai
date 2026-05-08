'use strict';

const { fetchStarterBundle } = require('./bundle');
const { header } = require('./util');

async function pull() {
  header('Re-downloading starter bundle');
  fetchStarterBundle({ force: true });
}

module.exports = pull;
