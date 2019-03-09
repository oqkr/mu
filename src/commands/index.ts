import CommandMap from '../command/CommandMap';

import cat from './cat';
import dog from './dog';
import mod from './mod'
import ping from './ping';
import xkcd from './xkcd';

const commands = new CommandMap(cat, dog, mod, ping, xkcd);

export default commands;
