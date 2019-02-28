import { Client, ClientOptions } from 'discord.js';

import Config from './Config';

/** Wraps a Discord#Client to add a Config. */
class Bot extends Client {
  constructor(readonly config: Config, options: ClientOptions = {}) {
    super(options);
  }

  /**
   * Logs in using Discord#Client.login.
   *
   * @param token A Discord API token. If not supplied, this uses a token from
   *     this.config if present.
   * @returns The token used.
   */
  async login(token?: string): Promise<string> {
    return super.login(token || this.config.get('token'));
  }
}

export default Bot;
