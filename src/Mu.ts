import * as discord from 'discord.js';

import Config from './Config';
import log from './log';
import { ChatProvider } from './providers';

type Options = {
  config: Config;
  chatProvider?: ChatProvider;
  options?: discord.ClientOptions;
};

class Mu extends discord.Client {
  readonly config: Config;
  private chatProvider?: ChatProvider;

  constructor(options: Options) {
    super(options.options || {});
    this.config = options.config;
    this.chatProvider = options.chatProvider;
  }

  /** Sends a conversational reply to a message if a chat provider is set. */
  async chat(message: discord.Message): Promise<void> {
    if (!this.chatProvider) return;
    message.channel.startTyping();
    try {
      const reply = await this.chatProvider.chat(message.cleanContent);
      await message.channel.send(reply);
    } finally {
      message.channel.stopTyping();
    }
  }

  hasChatProvider(): boolean {
    return this.chatProvider !== undefined;
  }

  async login(token?: string): Promise<string> {
    log.pending('Bot logging in …');
    return super.login(token || this.config.token);
  }

  setChatProvider(provider: ChatProvider): void {
    this.chatProvider = provider;
  }
}

export default Mu;
