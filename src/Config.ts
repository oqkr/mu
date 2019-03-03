import * as fs from 'fs';
import * as os from 'os';
import { join as joinPaths } from 'path';
import * as toml from 'toml';

/** Default config file location. */
const defaultPath = joinPaths(os.homedir(), '.config/mu/config.toml');

/** The names and values we recognize in a TOML file. */
type KnownSettings = {
  prefix?: string;
  token?: string;
  cleverbot?: {
    user?: string;
    key?: string;
  };
};

/** Settings loaded from a TOML file or from the environment. */
class Config {
  /** The prefix for invoking bot commands (defaults to `%`). */
  readonly prefix: string;

  /** The Discord API token to use. */
  readonly token: string;

  /** Settings for accessing Cleverbot API. */
  readonly cleverbot: { user: string; key: string };

  /**
   * This creates a Config from the values of these environment variables:
   *
   *  - MU_CLEVERBOT_USER
   *  - MU_CLEVERBOT_KEY
   *  - MU_COMMAND_PREFIX
   *  - MU_DISCORD_TOKEN
   *
   * If str is given, this creates a Config from parsing str as the contents
   * of a TOML config file then merges any values present in the environment,
   * with values from the environment overriding those from the file.
   *
   * @param str The contents of a TOML config file.
   */
  private constructor(str?: string) {
    const settings = str ? (toml.parse(str) as KnownSettings) : {};
    const cleverbot = settings.cleverbot || {};
    this.prefix = process.env.MU_COMMAND_PREFIX || settings.prefix || '%';
    this.token = process.env.MU_DISCORD_TOKEN || settings.token || '';
    this.cleverbot = {
      user: process.env.MU_CLEVERBOT_USER || cleverbot.user || '',
      key: process.env.MU_CLEVERBOT_KEY || cleverbot.key || '',
    };
  }

  /** Create a Config from environment variables. */
  static fromEnv(): Config {
    return new Config();
  }

  /**
   * Create a Config from a TOML file.
   * @param path The path to the file (defaults to
   *     `${HOME}/.config/mu/config.toml`).
   */
  static fromFile(path: string = defaultPath): Config {
    return new Config(fs.readFileSync(path, 'utf8'));
  }
}

export default Config;
