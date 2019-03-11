import Cleverbot from './apis/cleverbot.io';
import Config from './Config';
import handleMessage from './eventHandlers/onMessage';
import handleReady from './eventHandlers/onReady';
import log from './log';
import Mu from './Mu';

const config = Config.fromFile();
const mu = new Mu({ config });

if (config.cleverbot.user && config.cleverbot.key) {
  const cleverbot = new Cleverbot(config.cleverbot.user, config.cleverbot.key);
  mu.setChatProvider(cleverbot);
}

mu.on('ready', handleReady);
mu.on('message', handleMessage);
mu.on('error', log.error);

mu.login().catch(log.fatal);
