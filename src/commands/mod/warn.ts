import { Message } from 'discord.js';

import { Command } from '../../command';

const usage = `
Usage: warn <user_id>
       warn <user_mention>

Issues a warning to a user.
`;

/** Issues a warning to a user. */
const warn: Command = {
  name: 'warn',
  usage,
  run: async (message: Message): Promise<void> => {
    await message.reply("stop what yer *fuckin' doin'*, bro");
  },
};

export default warn;
