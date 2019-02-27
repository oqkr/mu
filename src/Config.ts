import * as fs from 'fs';
import * as os from 'os';
import * as toml from 'toml';
import { join as joinPaths } from 'path';

import log from './log';

const defaultPath = joinPaths(os.homedir(), '.config/mu/config.toml');
const defaultPrefix = '%';

interface Cache {
  path: string;
  config: Config | null;
}

export default class Config extends Map<string, any> {
  private static readonly cache: Cache = { path: '', config: null };
  public static fromFile(
    path: string = defaultPath,
    expireCache: boolean = false
  ): Config {
    log.debug(`Making a Config from path ${path}`);
    const { cache } = Config;
    if (!expireCache && cache.config && cache.path === path) {
      log.debug('Using cached config');
      return cache.config;
    }
    const data = toml.parse(fs.readFileSync(path, 'utf8'));
    if (!data.prefix) data.prefix = defaultPrefix;
    const config = new Config(Object.entries(data));
    cache.path = path;
    cache.config = config;
    return config;
  }
}
