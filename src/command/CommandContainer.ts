import { KeyError } from '../errors';

import Command from './Command';
import HelpCommand from './HelpCommand';

/**
 * A Map-like container of commands indexed by name.
 *
 * If the commands passed to the constructor do not include a help command,
 * a default help command is inserted into the container.
 */
class CommandContainer {
  private readonly map: Map<string, Command> = new Map();

  constructor(...commands: Command[]) {
    commands.forEach((command: Command) => this.map.set(command.name, command));
    if (!this.map.has('help')) this.map.set('help', new HelpCommand(this));
  }

  /**
   * Returns the named command.
   *
   * This throws a KeyError if the command is not found, so always use `has`
   * first to check.
   */
  get(command: string): Command {
    const maybeCommand = this.map.get(command);
    if (!maybeCommand) {
      throw new KeyError(`command \`${command}\` not in container`);
    }
    return maybeCommand;
  }

  /** Returns true if command is in container. */
  has(command: string): boolean {
    return this.map.has(command);
  }

  /** Return an iterator over the names of commands in this container. */
  keys(): Iterator<string> {
    return this.map.keys();
  }
}

export default CommandContainer;
