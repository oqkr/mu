'use strict';

const fs = require('fs');
const { join } = require('path');
const os = require('os');
const toml = require('toml');

const log = require('./log.js');

const cache = { path: '', config: null };
const defaultPath = join(os.homedir(), '.config/mu/config.toml');
const defaultPrefix = '%';

module.exports.load = (path = defaultPath, invalidateCache = false) => {
  log.debug(`Config path: ${path}`);
  if (!invalidateCache && cache.config && cache.path === path) {
    log.debug('Using cached config');
    return cache.config;
  }
  log.debug('Using fresh config, no cache');
  let config = toml.parse(fs.readFileSync(path, 'utf8'));
  if (!config.prefix) config.prefix = defaultPrefix;
  cache.path = path;
  cache.config = config;
  return config;
};
