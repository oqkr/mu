import { Message } from 'discord.js';

import { KeyError } from '../errors';

import Command from './Command';
import CommandContainer from './CommandContainer';

const defaultHelpUsage = `
Usage: help <command>

Displays usage for the named command.
`;

/** A Map-like container of commands indexed by name. */
export default class Commands implements CommandContainer {
  private readonly map: Map<string, Command> = new Map();

  /**
   * Creates a Commands and generates a help command for its items.
   * @param helpUsage A usage message for the help command (defaults to
   *     defaultHelpUsage).
   * @param commands The commands to add.
   */
  constructor(helpUsage: string, ...commands: Command[]);

  /**
   * Creates a Commands and generates a help command for its items.
   * @param commands The commands to add.
   */
  constructor(...commands: Command[]);

  constructor() {
    let commands: Command[];
    let helpUsage = defaultHelpUsage;
    if (typeof arguments[0] === 'string') {
      helpUsage = arguments[0] as string;
      commands = Array.prototype.slice.call(arguments, 1) as Command[];
    } else {
      commands = Array.from(arguments) as Command[];
    }
    commands.forEach((command: Command) => this.map.set(command.name, command));

    // tslint:disable-next-line:no-this-assignment
    const that = this;

    this.map.set('help', {
      name: 'help',
      usage: helpUsage,
      async run(message: Message, ...args: string[]): Promise<void> {
        if (!args.length || args[0] === 'help') {
          await message.channel.send(`\`\`\`${helpUsage}\`\`\``);
          return;
        }
        const command = args[0];
        if (!that.has(command)) {
          await message.channel.send(`error: no command named \`${command}\``);
          return;
        }
        const reply = `\`\`\`${that.get(command).usage}\`\`\``;
        await message.channel.send(reply);
      },
    });
  }

  /**
   * Returns the named command.
   * @throws KeyError if command not found, so always check with `has` first.
   */
  get(name: string): Command {
    const command = this.map.get(name);
    if (!command) throw new KeyError(`command \`${name}\` not in container`);
    return command;
  }

  /** Returns true if the named command is in the container. */
  has(name: string): boolean {
    return this.map.has(name);
  }

  /** Returns an iterator for the names of commands in this container. */
  keys(): Iterator<string> {
    return this.map.keys();
  }
}
