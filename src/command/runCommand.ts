import { Message } from 'discord.js';

import isAllowed from '../isAllowed';

import CommandMap from './CommandMap';

/**
 * Runs a bot command if it exists in the current context.
 *
 * @param message The message that invoked this command.
 * @param commands All the commands that are available in the current context.
 * @param name The name of the command to run.
 * @param args Arguments to pass to command.
 */
export default async function runCommand(
  message: Message,
  commands: CommandMap,
  name: string,
  ...args: string[]
): Promise<void> {
  const command = commands.get(name);
  // TODO: Calculate Levenshtein distance and recommend commands user might
  // have meant instead of just throwing an error.
  if (!command) throw new Error(`\`${name}\` is not a known command`);
  const user =
    message.channel.type === 'text'
      ? await message.guild.fetchMember(message.author)
      : message.author;
  if (!isAllowed(user, command)) {
    throw new Error(`${user} not authorized for command \`${name}\``);
  }
  await command.run(message, ...args);
}
