import Command from '../Command';

import cat from './cat';
import help from './help';
import ping from './ping';

/** Interface for a collection of commands indexed by name. */
interface CommandContainer {
  readonly [index: string]: Command;
}

const commands: CommandContainer = {
  cat,
  help,
  ping,
};

export default commands;
