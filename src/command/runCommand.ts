import { Message } from 'discord.js';

import CommandContainer from './CommandContainer';

/**
 * Run a bot command if it exists in the current context.
 *
 * @param message The message that invoked this command.
 * @param commands All the commands that are available in the current context.
 * @param command The name of the command to run.
 * @param args Arguments to pass to command.
 */
export default async function runCommand(
  message: Message,
  commands: CommandContainer,
  command: string,
  ...args: string[]
): Promise<void> {
  if (!commands.has(command)) {
    // TODO: Calculate Levenshtein distance and recommend commands user might
    // have meant instead of just sending an error.
    const reply = `\`${command}\` is not a known command, you stupid fuck`;
    await message.channel.send(reply);
    return;
  }
  await commands.get(command).run(message, ...args);
}
