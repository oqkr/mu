/* tslint:disable */

import { Message } from 'discord.js';

import Command from '../Command';

import commands from '.';

const usage = `
Usage: help <command>

Displays usage for the named command.
`;

/** Displays usage for the named command. */
const help: Command = {
  name: 'help',
  usage,
  run: async (message: Message, ...args: string[]): Promise<void> => {
    if (args.length < 1) {
      await message.channel.send(`\`\`\`${usage}\`\`\``);
      return;
    }
    const command = args[0];
    if (!(command in commands)) {
      await message.channel.send(`error: no command named \`${command}\``);
      return;
    }
    await message.channel.send(`\`\`\`${commands[command].usage}\`\`\``);
  },
};

export default help;
