import { Message } from 'discord.js';

import Command from '../../command/Command';
import CommandMap from '../../command/CommandMap'
import runCommand from '../../command/runCommand'
import log from '../../log';

import ban from './ban';
import kick from './kick';
import unban from './unban';
import warn from './warn';

const commands = new CommandMap(ban, kick, unban, warn);

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
  allowedRole: 'Moderator',

  async run(message: Message, ...args: string[]): Promise<void> {
    if (!args.length || args[0] === 'help') {
      await message.channel.send(`\`\`\`${usage}\`\`\``);
      return;
    }
    const [command, ...args2] = args;
    try {
      await runCommand(message, commands, command, ...args2);
    } catch (err) {
      log.error(`caught exception running ${command}: ${err}`);
      await message.channel.send(`command threw exception: ${err}`);
    }
  },
};

export default mod;
