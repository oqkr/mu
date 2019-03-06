import { CommandContainer } from '../command';

import cat from './cat';
import dog from './dog';
import mod from './mod'
import ping from './ping';
import xkcd from './xkcd';

const commands = new CommandContainer(cat, dog, mod, ping, xkcd);

export default commands;
