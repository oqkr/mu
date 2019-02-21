'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();

const log = require('./lib/log.js');
const { token } = require('./lib/config.js').load();

client.on('ready', () => log.success('bot online and ready'));

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
    log.info('ping/pong handler fired');
  }
});

log.pending('bot logging in …');
client.login(token);
