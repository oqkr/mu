import Cleverbot from './apis/cleverbot.io';
import Bot from './Bot.js';
import Config from './Config.js';
import handleMessage from './eventHandlers/onMessage';
import handleReady from './eventHandlers/onReady';
import log from './log.js';

const config = Config.fromFile();
const bot = new Bot({ config });

if (config.cleverbot.user && config.cleverbot.key) {
  const cleverbot = new Cleverbot(config.cleverbot.user, config.cleverbot.key);
  bot.setChatProvider(cleverbot);
}

bot.on('ready', handleReady);
bot.on('message', handleMessage);
bot.on('error', log.error);

bot.login().catch(log.fatal);
