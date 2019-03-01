import * as fs from 'fs';
import * as os from 'os';
import { join as joinPaths } from 'path';
import * as toml from 'toml';

const defaultPath = joinPaths(os.homedir(), '.config/mu/config.toml');

/** The names and values we recognize in config files. */
type KnownSettings = {
  prefix?: string;
  token?: string;
  cleverbot?: {
    user?: string;
    key?: string;
  };
};

/** Represents settings loaded from a TOML config file. */
class Config {
  /** The prefix for invoking bot commands (defaults to `%`). */
  readonly prefix: string;

  /** The Discord API token to use. */
  readonly token: string;

  /** Settings for accessing Cleverbot API. */
  readonly cleverbot: { user: string; key: string };

  /** @param str The contents of a TOML file. */
  private constructor(str: string) {
    const settings = toml.parse(str) as KnownSettings;
    const cleverbot = settings.cleverbot || {};
    this.cleverbot = { user: cleverbot.user || '', key: cleverbot.key || '' };
    this.prefix = settings.prefix || '%';
    this.token = settings.token || '';
  }

  /**
   * Create a Config from a TOML file.
   * @param path The path to the config file (defaults to
   *     `${HOME}/.config/mu/config.toml`).
   */
  static fromFile(path: string = defaultPath): Config {
    return new Config(fs.readFileSync(path, 'utf8'));
  }
}

export default Config;
