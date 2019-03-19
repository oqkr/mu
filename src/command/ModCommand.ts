import { Message } from 'discord.js';

import SuperCommand, { ConstructorParams } from './SuperCommand';

/** A SuperCommand accessible by moderators inside of a guild (not in DMs). */
export default class ModCommand extends SuperCommand {
  constructor(params: ConstructorParams) {
    params.allowedRole = 'Moderator';
    super(params);
  }

  async run(message: Message, ...args: string[]): Promise<void> {
    if (message.channel.type !== 'text') {
      throw new Error('mod commands can only be used within a guild');
    }
    return super.run(message, ...args);
  }
}
