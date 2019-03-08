import Command from './Command';

/** An interface for Map-like containers of commands indexed by name. */
export default interface CommandContainer {
  /** Returns the named command. */
  get(name: string): Command;

  /** Returns true if the named command is in the container. */
  has(name: string): boolean;

  /** Returns an iterator for the names of commands in this container. */
  keys(): Iterator<string>;
}
