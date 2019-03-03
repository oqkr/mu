import { Message } from 'discord.js';

/** Interface for bot commands. */
export default interface Command {
  /** Canonical name of the command. */
  name: string;

  /** Command usage info to format as help messages. */
  usage: string;

  /**
   * Runs this command.
   * @param message The message that invoked this command.
   * @param args Arguments passed to command.
   */
  run(message: Message, ...args: string[]): Promise<void>;
}
