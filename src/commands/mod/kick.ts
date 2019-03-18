import { Message } from 'discord.js';
import * as minimist from 'minimist';

import Command from '../../command/Command';
import { guildMemberFromString } from '../../utils';

const usage = `
Usage: mod kick [options] { user_id | user_mention }

Kicks users from the server.

Options:
  -r, --reason string  Message to add to audit log.

Example:
  @mu mod kick --reason "uses Tik Tok" @user1 @user2 @user3
`;

/** Main entry point for kick command. */
async function run(message: Message, ...args: string[]): Promise<void> {
  const argv = minimist(args, {
    alias: { r: 'reason' },
    default: { reason: 'fuck off, jabroni' },
    string: ['reason', 'r', '_'],
  });

  const reason =
    typeof argv.r === 'string' ? argv.r : (argv.r as string[]).pop();
  const users = argv._;

  if (!reason) {
    const reply = 'error: `reason` option missing required argument';
    await message.channel.send(reply);
    return;
  } else if (!users.length) {
    await message.channel.send('error: no user specified');
    return;
  }
  for (const user of users) {
    const member = await guildMemberFromString(message.guild, user);
    await member.kick(reason);
  }
}

/** Kicks a user from the server. */
const kick: Command = { name: 'kick', allowedRole: 'Moderator', usage, run };

export default kick;
