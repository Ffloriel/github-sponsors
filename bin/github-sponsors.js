#!/usr/bin/env node

const { init } = require("../lib/github-sponsors.cjs");

init()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));