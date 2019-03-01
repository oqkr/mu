import { Message } from 'discord.js';

import Command from '../Command';

/** Responds to "ping" with "pong." */
const ping: Command = {
  name: 'ping',
  run: async (message: Message): Promise<void> => {
    await message.channel.send('pong, motherfucker');
  },
};

export default ping;
