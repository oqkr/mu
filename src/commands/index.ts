import Commands from '../command/Commands';

import cat from './cat';
import dog from './dog';
import mod from './mod'
import ping from './ping';
import xkcd from './xkcd';

const commands = new Commands(cat, dog, mod, ping, xkcd);

export default commands;
