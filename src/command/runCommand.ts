import { Message } from 'discord.js';

import isAllowed from '../isAllowed';

import CommandContainer from './CommandContainer';

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
  commands: CommandContainer,
  name: string,
  ...args: string[]
): Promise<void> {
  if (!commands.has(name)) {
    // TODO: Calculate Levenshtein distance and recommend commands user might
    // have meant instead of just sending an error.
    const reply = `\`${name}\` is not a known command, you stupid fuck`;
    await message.channel.send(reply);
    return;
  }

  const user =
    message.channel.type === 'text'
      ? await message.guild.fetchMember(message.author)
      : message.author;
  const command = commands.get(name);

  if (!isAllowed(user, command)) {
    await message.reply("fuck outta here dude you can't use this");
    return;
  }
  await command.run(message, ...args);
}
