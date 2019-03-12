import { Message } from 'discord.js';

import SuperCommand, { Params } from './SuperCommand';

/** A SuperCommand accessible by moderators inside of a guild (not in DMs). */
export default class ModCommand extends SuperCommand {
  constructor(params: Params) {
    params.allowedRole = 'Moderator';
    super(params);
  }

  async run(message: Message, ...args: string[]): Promise<void> {
    if (message.channel.type !== 'text') {
      const reply = 'error: mod commands can only be used within a guild'
      await message.channel.send(reply)
      return;
    }
    return super.run(message, ...args);
  }
}
