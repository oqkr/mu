import { Message } from 'discord.js';

import { Command } from '../command';

const usage = `
Usage: ping

Responds with pong.
`;

/** Responds with pong. */
const ping: Command = {
  name: 'ping',
  usage,
  run: async (message: Message): Promise<void> => {
    await message.channel.send('pong, motherfucker');
  },
};

export default ping;
