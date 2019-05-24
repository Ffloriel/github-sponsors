#!/usr/bin/env node

const { init } = require("../lib/github-sponsors.cjs");

init().then().catch(console.err)