import { Message } from 'discord.js';

/** Interface for bot commands. */
export default interface Command {
  /** Canonical name of the command. */
  readonly name: string;

  /** Command usage info to format as help messages. */
  readonly usage: string;

  /**
   * The lowest role that can use the command.
   *
   * This can be either the name of a role or a role ID.
   *
   * If the value is undefined or empty, this command is allowed by every
   * role. To allow only the guild owner, use "owner"; to disallow all roles,
   * use "none".
   */
  readonly allowedRole?: string;

  /**
   * The IDs of users who can always use this command regardless of role.
   *
   * If the value is undefined or empty, this field is ignored.
   *
   * Note that if this command is invoked outside of any guild (i.e., in a
   * direct message), this is the only field that will be checked for access
   * control — so leaving it blank in that case means anyone can run it.
   */
  readonly allowedUsers?: ReadonlyArray<string>;

  /**
   * Runs the command.
   * @param message The message that invoked this command.
   * @param args Arguments passed to command.
   */
  run(message: Message, ...args: string[]): Promise<void>;
}
