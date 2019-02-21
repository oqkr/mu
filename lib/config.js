'use strict';

const fs = require('fs');
const log = require('./log.js')
const os = require('os');
const path = require('path');
const toml = require('toml');

const defaultPath = path.join(os.homedir(), '.config', 'mu', 'config.toml');

exports.load = (p = defaultPath) => {
  log.info(`config path: ${p}`);
  return toml.parse(fs.readFileSync(p, 'utf8'));
};
