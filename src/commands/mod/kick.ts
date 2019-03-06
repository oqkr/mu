import { Message } from 'discord.js';

import { Command } from '../../command';

const usage = `
Usage: kick <user_id>
       kick <user_mention>

Kicks a user from the server.
`;

/** Kicks a user from the server. */
const kick: Command = {
  name: 'kick',
  usage,
  run: async (message: Message): Promise<void> => {
    await message.reply("I'ma kick yer fuckin' ass, bro");
  },
};

export default kick;
