import { CommandContainer } from '../command';

import cat from './cat';
import dog from './dog';
import ping from './ping';
import xkcd from './xkcd';

const commands = new CommandContainer(cat, dog, ping, xkcd);

export default commands;
