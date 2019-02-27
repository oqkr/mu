import { Message } from 'discord.js';

/** Interface for general bot commands. */
export default interface Command {
  /** Canonical name of the command. */
  name: string;

  /**
   * Runs this command.
   *
   * @param message The message that invoked this command.
   * @param args Arguments passed to command.
   */
  run(message: Message, ...args: string[]): Promise<void>;
}
