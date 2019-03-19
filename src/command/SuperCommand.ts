import { Message } from 'discord.js';

import Command from './Command';
import CommandMap from './CommandMap';
import runCommand from './runCommand';

export type ConstructorParams = {
  name: string;
  usage: string;
  allowedRole?: string;
  allowedUsers?: string[];
  subcommands?: Command[];
};

/** A Command that contains subcommands. */
export default class SuperCommand implements Command {
  readonly name: string;
  readonly usage: string;
  readonly allowedRole?: string;
  readonly allowedUsers?: string[];
  private readonly subcommands: CommandMap;

  constructor(params: ConstructorParams) {
    this.name = params.name;
    this.usage = params.usage;
    this.allowedRole = params.allowedRole;
    this.allowedUsers = params.allowedUsers;
    this.subcommands = new CommandMap(
      this.usage,
      ...(params.subcommands || [])
    );
  }

  /**
   * @param message The message that invoked this command.
   * @param args Arguments passed to command.
   */
  async run(message: Message, ...args: string[]): Promise<void> {
    const [command, ...args2] = args;
    await runCommand(message, this.subcommands, command || 'help', ...args2);
  }
}
