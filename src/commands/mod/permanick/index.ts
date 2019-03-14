import * as discord from 'discord.js';

import Command from '../../../command/Command';

import Permanick from './Permanick';

const usage = `
Usage: mod permanick [options] user [user...] [nickname]

Nicknames a user — permanently. If the user attempts to change his name back, \
he will automatically be renicked.

Options:
  -d, --duration minutes  Set a limit in minutes on how long this nick cannot
                          be changed (default: forever).

  -r, --remove            Release a user from the shackles of permanick.

Examples:
  @mu mod permanick @user "poophead"
  @mu mod permanick --duration=30 @user1 @user2 "limp noodle"
  @mu mod permanick --remove @user
`;

/** Nicknames a user — permanently. */
const permanick: Command = {
  name: 'permanick',
  usage: usage,
  allowedRole: 'Moderator',
  run: async (message: discord.Message, ...args: string[]) =>
    new Permanick(message, ...args).run(),
};

export default permanick;
