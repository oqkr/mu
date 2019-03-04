import Command from '../Command';

import cat from './cat';
import dog from './dog';
import help from './help';
import ping from './ping';
import xkcd from './xkcd';

/** Interface for a collection of commands indexed by name. */
interface CommandContainer {
  readonly [index: string]: Command;
}

const commands: CommandContainer = {
  cat,
  dog,
  help,
  ping,
  xkcd,
};

export default commands;
