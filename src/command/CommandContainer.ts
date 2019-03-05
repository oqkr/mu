import Command from './Command';

/** Interface for a collection of commands indexed by name. */
interface CommandContainer {
  readonly [index: string]: Command;
}

export default CommandContainer;
