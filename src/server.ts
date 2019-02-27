import { Message } from 'discord.js';

import Bot from './Bot.js';
import Config from './config.js';
import { handleMessage } from './eventHandlers';
import log from './log.js';

const bot = new Bot(Config.fromFile());

bot.on('ready', () => log.success('Bot online and ready'));
bot.on('message', (message: Message) => log.debug(`Got message: ${message}`));
bot.on('message', handleMessage);

log.pending('Bot logging in …');
bot.login().catch(log.fatal);
