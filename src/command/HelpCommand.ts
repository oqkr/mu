import { Message } from 'discord.js';

import Command from './Command';
import CommandContainer from './CommandContainer';

const defaultUsage = `
Usage: help <command>

Displays usage for the named command.
`;

/** A command that knows how to display help for a given set of commands. */
class HelpCommand implements Command {
  readonly name: string = 'help';

  constructor(
    /** All the commands for which this can display usage. */
    readonly commands: CommandContainer,
    /** Usage for the help command itself. */
    readonly usage: string = defaultUsage
  ) {}

  /** Displays usage for the named command. */
  async run(message: Message, ...args: string[]): Promise<void> {
    if (args.length < 1) {
      await message.channel.send(`\`\`\`${this.usage}\`\`\``);
      return;
    }
    const command = args[0];
    if (!this.commands.has(command)) {
      await message.channel.send(`error: no command named \`${command}\``);
      return;
    }
    const reply = `\`\`\`${this.commands.get(command).usage}\`\`\``
    await message.channel.send(reply);
  }
}

export default HelpCommand;
