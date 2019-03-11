import { Message } from 'discord.js';
import { split } from 'shlex';

import runCommand from '../command/runCommand';
import commands from '../commands';
import log from '../log';
import Mu from '../Mu';

/** The type for handler functions in this module. */
type MessageHandler = (message: Message) => Promise<boolean>;

/**
 * Handles message event by delegating to a relevant subhandler.
 * @param message The message from the message event.
 * @returns True if the event is now considered handled.
 */
async function handleMessage(message: Message): Promise<boolean> {
  const mu = message.client as Mu;
  if (mu.user.id === message.author.id) return true;

  const handlers: MessageHandler[] = [
    logMessage,
    handleCommand,
    handleMention,
    handleName,
  ];
  for (const handle of handlers) {
    try {
      if (await handle(message)) return true;
    } catch (err) {
      log.error(`caught exception running handler \`${handle.name}\`: ${err}`);
      return false;
    }
  }
  return false;
}

/**
 * Handles message event if message starts with bot mention or command prefix.
 * @param message The message from the message event.
 * @returns True if the event is now considered handled.
 */
async function handleCommand(message: Message): Promise<boolean> {
  const mu = message.client as Mu;
  const re = new RegExp(`^${mu.config.prefix}|^<@!?${mu.user.id}>`);
  if (!re.test(message.content)) return false;

  const words = split(message.content.replace(re, ''));
  if (words.every((word: string): boolean => /^\s*$/.test(word))) {
    // words is empty or all its elements are whitespace.
    await message.channel.send('the fuck you want?');
    return true;
  }
  const [command, ...args] = words;
  try {
    await runCommand(message, commands, command, ...args);
  } catch (err) {
    log.error(`caught exception running ${command}: ${err}`);
  }
  return true;
}

/**
 * Handles message event if message does not *begin* with prefix or bot mention
 * but does contain bot mention elsewhere in message.
 * @param message The message from the message event.
 * @returns True if the event is now considered handled.
 */
async function handleMention(message: Message): Promise<boolean> {
  const mu = message.client as Mu;
  const re = new RegExp(`<@!?${mu.user.id}>`);
  if (!re.test(message.content)) return false;

  await chat(message);
  return true;
}

/**
 * Handles message event if message contains the bot's username or its nickname
 * in the current guild.
 * @param message The message from the message event.
 * @returns True if the event is now considered handled.
 */
async function handleName(message: Message): Promise<boolean> {
  const mu = message.client as Mu;
  let nickname: string | undefined;
  if (message.guild && message.guild.available) {
    ({ nickname } = await message.guild.fetchMember(mu.user));
  }
  const re = nickname
    ? new RegExp(`\\b(${mu.user.username}|${nickname})\\b`, 'i')
    : new RegExp(`\\b${mu.user.username}\\b`, 'i');
  if (!re.test(message.content)) return false;

  await chat(message);
  return true;
}

/**
 * Logs message event at log-level debug.
 *
 * Logging an event should never mark it handled, so this always returns false.
 * @param message The message from the message event.
 * @returns True if the event is now considered handled.
 */
async function logMessage(message: Message): Promise<boolean> {
  log.debug(`Got message: ${message}`);
  return false;
}

/** Sends a conversational reply to message. */
async function chat(message: Message): Promise<void> {
  const mu = message.client as Mu;
  if (!mu.hasChatProvider()) {
    await message.channel.send(`shut the fuck up, ${message.author}`);
    return;
  }
  await mu.chat(message);
}

export default handleMessage;
