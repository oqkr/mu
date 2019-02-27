import Command from '../Command';

import cat from './cat';
import ping from './ping';

/** Interface for a collection of commands indexed by name. */
interface CommandContainer {
  [index: string]: Command;
}

const commands: CommandContainer = { cat, ping };

export default commands;
