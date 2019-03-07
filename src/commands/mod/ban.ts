import { Message } from 'discord.js';
import * as minimist from 'minimist';

import Command from '../../command/Command';
import { guildMemberFromString } from '../../utils/user';

const usage = `
Usage: ban [options] { user_id | user_mention }

Ban users from the server.

Options:
  -r, --reason string        Message to add to audit log.
  -d, ---days-to-delete num  Number of days of messages to delete.

Example:
  ban --reason "watches pewdiepie" @user1 @user2 @user3
`;

/** Main entry point for ban command. */
async function run(message: Message, ...args: string[]): Promise<void> {
  const argv = minimist(args, {
    alias: { r: 'reason', d: ['days-to-delete', 'days'] },
    default: { reason: 'fuck off, jabroni', 'days-to-delete': '0' },
    string: ['reason', 'd', 'days', 'days-to-delete', '_'],
  });

  const reason =
    typeof argv.r === 'string' ? argv.r : (argv.r as string[]).pop();
  const days = parseInt(
    (typeof argv.d === 'string' ? argv.d : (argv.d as string[]).pop()) || '',
    10
  );
  const users = argv._;

  if (!reason) {
    const reply = 'error: `reason` option missing required argument';
    await message.channel.send(reply);
    return;
  } else if (Number.isNaN(days)) {
    await message.channel.send('error: `days` must be a number');
    return;
  } else if (!users.length) {
    await message.channel.send('error: no user specified');
    return;
  }
  for (const user of users) {
    const member = await guildMemberFromString(message.guild, user);
    await member.ban({ reason, days });
  }
}

/** Bans a user from the server. */
const ban: Command = { name: 'ban', allowedRole: 'Moderator', usage, run };

export default ban;
