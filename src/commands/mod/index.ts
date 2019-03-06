import { Message } from 'discord.js';

import { Command, CommandContainer, runCommand } from '../../command';
import log from '../../log';
import { allowedToUse } from '../../utils';

import kick from './kick';

const commands = new CommandContainer(kick);

const usage = `
Usage: mod <command>
       mod help <command>

Invokes one of the registered moderation commands.

Users must have moderator role or higher to access this.
`;

/** Parent mod command for invoking mod subcommands. */
const mod: Command = {
  name: 'mod',
  usage,
  allowedBy: 'Moderator',

  async run(message: Message, ...args: string[]): Promise<void> {
    if (!args.length || (args.length === 1 && args[0] === 'help')) {
      await message.channel.send(`\`\`\`${usage}\`\`\``);
      return;
    }
    const user = await message.guild.fetchMember(message.author);
    if (!allowedToUse(user, this)) {
      await message.reply("fuck outta here dude you can't use this");
      return;
    }
    const [command, ...args2] = args;
    try {
      await runCommand(message, commands, command, ...args2);
    } catch (err) {
      log.error(`caught exception running ${command}: ${err}`);
    }
  },
};

export default mod;
