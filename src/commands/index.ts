import { CommandContainer } from '../command';

import cat from './cat';
import dog from './dog';
import help from './help';
import ping from './ping';
import xkcd from './xkcd';

const commands: CommandContainer = {
  cat,
  dog,
  help,
  ping,
  xkcd,
};

export default commands;
