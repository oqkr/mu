import { Message } from 'discord.js';

import Command from './Command';

const defaultHelpUsage = `
Usage: help <command>

Displays usage for the named command.
`;

/** A Map of Commands indexed by name. */
export default class CommandMap extends Map<string, Command>
  implements ReadonlyMap<string, Command> {
  /**
   * Creates a CommandMap and generates a help command for its items.
   * @param helpUsage A usage message for the help command (defaults to
   *     defaultHelpUsage).
   * @param commands The commands to add.
   */
  constructor(helpUsage: string, ...commands: Command[]);

  /**
   * Creates a CommandMap and generates a help command for its items.
   * @param commands The commands to add.
   */
  constructor(...commands: Command[]);

  constructor() {
    super();
    let commands: Command[];
    let helpUsage = defaultHelpUsage;
    if (typeof arguments[0] === 'string') {
      helpUsage = arguments[0] as string;
      commands = Array.prototype.slice.call(arguments, 1) as Command[];
    } else {
      commands = Array.from(arguments) as Command[];
    }
    commands.push(this.createHelpCommand(helpUsage));
    commands.forEach(command => this.set(command.name, command));
  }

  private createHelpCommand(usage: string) {
    return {
      name: 'help',
      usage: usage,
      run: async (message: Message, ...args: string[]): Promise<void> => {
        const commandName = args[0];
        if (!args.length || commandName === 'help') {
          const moreUsage = this.appendListOfAvailableCommandsToUsage(usage);
          await message.channel.send(moreUsage, { code: true });
          return;
        }
        const command = this.get(commandName);
        if (!command) throw new Error(`\`${commandName}\` command not found`);
        await message.channel.send(command.usage, { code: true });
      },
    };
  }

  private appendListOfAvailableCommandsToUsage(usage: string): string {
    const commandNames = Array.from(this.keys())
      .sort()
      .join(', ');
    return `${usage}\nAvailable commands in current context: ${commandNames}`;
  }
}
