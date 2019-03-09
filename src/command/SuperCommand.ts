import { Message } from 'discord.js';

import log from '../log';

import Command from './Command';
import CommandContainer from './CommandContainer';
import CommandMap from './CommandMap';
import runCommand from './runCommand';

/** Arguments for SuperCommand constructor */
type Params = {
  /** Canonical name of the command. */
  name: string;

  /** Command usage info to format as help messages. */
  usage: string;

  /** The lowest role that can use the command (see {@link Command}). */
  allowedRole?: string;

  /**
   * IDs of users who can always use this command regardless of role
   * (see {@link Command}).
   */
  allowedUsers?: string[];

  /** List of commands to add. */
  subcommands?: Command[];
};

/** A command that contains other commands as subcommands. */
export default class SuperCommand implements Command {
  readonly name: string;
  readonly usage: string;
  readonly allowedRole?: string;
  readonly allowedUsers?: string[];
  private readonly subcommands: CommandContainer;

  constructor(params: Params) {
    this.name = params.name;
    this.usage = params.usage;
    this.allowedRole = params.allowedRole;
    this.subcommands = new CommandMap(
      this.usage,
      ...(params.subcommands || [])
    );
  }

  /**
   * Runs this command (satisfies Command interface).
   * @param message The message that invoked this command.
   * @param args Arguments passed to command.
   */
  async run(message: Message, ...args: string[]): Promise<void> {
    const [command, ...args2] = args;
    try {
      await runCommand(message, this.subcommands, command || 'help', ...args2);
    } catch (err) {
      log.error(`caught exception running ${command}: ${err}`);
      await message.channel.send(`command threw exception: ${err}`);
    }
  }
}
