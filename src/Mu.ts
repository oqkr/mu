import { Client, ClientOptions, Message } from 'discord.js';

import Config from './Config';
import log from './log';
import { ChatProvider } from './providers';

type Options = {
  config: Config;
  chatProvider?: ChatProvider;
  options?: ClientOptions;
};

/** Adds Mu-specific features to a Discord#Client. */
class Mu extends Client {
  readonly config: Config;
  private chatProvider?: ChatProvider;

  constructor(options: Options) {
    super(options.options || {});
    this.config = options.config;
    this.chatProvider = options.chatProvider;
  }

  /**
   * Logs in using Discord#Client.login.
   * @param token A Discord API token. If not supplied, this uses a token from
   *     this.config if present.
   * @returns The token used.
   */
  async login(token?: string): Promise<string> {
    log.pending('Bot logging in …');
    return super.login(token || this.config.token);
  }

  /** Sends a conversational reply to a message if a chat provider is set. */
  async chat(message: Message): Promise<void> {
    if (!this.chatProvider) return;
    message.channel.startTyping();
    try {
      await message.reply(await this.chatProvider.chat(message.cleanContent));
    } finally {
      message.channel.stopTyping();
    }
  }

  setChatProvider(provider: ChatProvider): void {
    this.chatProvider = provider;
  }

  hasChatProvider(): boolean {
    return this.chatProvider !== undefined;
  }
}

export default Mu;
