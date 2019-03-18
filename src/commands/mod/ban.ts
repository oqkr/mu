import { Message } from 'discord.js';
import * as minimist from 'minimist';

import Command from '../../command/Command';
import {
  convertMinimistArgToString,
  guildMemberFromString,
} from '../../utils';

const usage = `
Usage: mod ban [options] user [user...]

Bans users from the server.

Options:
  -r, --reason string        Message to add to audit log.
  -d, ---days-to-delete num  Number of days of messages to delete.

Example:
  @mu mod ban --reason "watches pewdiepie" @user1 @user2 @user3
`;

async function runBanCommand(message: Message, ...args: string[]) {
  const argv = minimist(args, {
    alias: { r: 'reason', d: ['days-to-delete', 'days'] },
    default: { reason: 'fuck off, jabroni', 'days-to-delete': '0' },
    string: ['reason', 'd', 'days', 'days-to-delete', '_'],
  });
  const reason = convertMinimistArgToString(argv.reason);
  const days = parseInt(convertMinimistArgToString(argv.days), 10);
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
const ban: Command = {
  name: 'ban',
  usage: usage,
  allowedRole: 'Moderator',
  run: runBanCommand,
};

export default ban;
