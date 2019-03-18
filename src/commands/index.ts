import CommandMap from '../command/CommandMap';

import cat from './cat';
import dog from './dog';
import mod from './mod'
import ping from './ping';
import upload from './upload';
import xkcd from './xkcd';

const commands = new CommandMap(cat, dog, mod, ping, upload, xkcd);

export default commands;
