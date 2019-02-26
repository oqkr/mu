'use strict';

const Bot = require('./lib/Bot.js');
const config = require('./lib/config.js').load();
const { handleMessage } = require('./lib/eventHandlers');
const log = require('./lib/log.js');

const bot = new Bot(config);

bot.on('ready', () => log.success('Bot online and ready'));
bot.on('message', message => log.debug(`Message received: ${message}`));
bot.on('message', message => handleMessage(message));

log.pending('Bot logging in …');
bot.login().catch(err => log.fatal(err));
