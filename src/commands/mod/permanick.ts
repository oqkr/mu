import { Guild, GuildMember, Message } from 'discord.js';
import * as minimist from 'minimist';

import Command from '../../command/Command';
import Mu from '../../Mu';
import { userIDFromString } from '../../utils/user';

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

const stickyNicks: Map<UserID, StickyNick> = new Map();

type UserID = string;

type StickyNick = {
  handler: GuildMemberUpdateHandler;
  timeout?: NodeJS.Timeout;
};

type GuildMemberUpdateHandler = (
  oldMember: GuildMember,
  newMember: GuildMember
) => Promise<void>;

const eventName = 'guildMemberUpdate';

async function runPermanickCommand(message: Message, ...args: string[]) {
  const {
    durationInMinutes,
    inRemoveMode,
    nickname,
    userIDs,
  } = parsePermanickArgs(...args);
  if (!userIDs.length) {
    await message.channel.send('error: no users specified');
    return;
  } else if (durationInMinutes < 0) {
    await message.channel.send('error: minutes cannot be less than 0');
    return;
  } else if (!inRemoveMode && !nickname) {
    await message.channel.send('error: missing nickname argument');
    return;
  }

  const mu = message.client as Mu;
  const { guild } = message;

  for (const userID of userIDs) {
    const member = await guild.fetchMember(userID);
    const stickyNick = stickyNicks.get(userID);

    if (stickyNick) {
      if (stickyNick.timeout) clearTimeout(stickyNick.timeout);
      mu.off(eventName, stickyNick.handler);
      stickyNicks.delete(userID);
    }
    if (inRemoveMode) {
      await member.setNickname('');
      continue;
    }
    await member.setNickname(nickname);

    const handler = makeGuildMemberUpdateHandler(guild, nickname);
    mu.on(eventName, handler);

    let timeout: NodeJS.Timeout | undefined;
    if (durationInMinutes) {
      timeout = setTimeout(async () => {
        mu.off(eventName, handler);
        stickyNicks.delete(userID);
        await member.setNickname('');
      }, durationInMinutes * 60 * 1000);
    }
    stickyNicks.set(userID, { handler, timeout });
  }
}

type PermanickArgs = {
  inRemoveMode: boolean;
  durationInMinutes: number;
  nickname: string;
  userIDs: string[];
};

function parsePermanickArgs(...args: string[]): PermanickArgs {
  const argv = minimist(args, {
    alias: { d: 'duration', r: 'remove' },
    default: { duration: '0', remove: false },
    string: ['d', 'duration', '_'],
    boolean: ['r', 'remove'],
  });
  const durationInMinutes = parseInt(
    typeof argv.duration === 'string'
      ? argv.duration
      : (argv.duration as string[]).pop() || '',
    10
  );
  const inRemoveMode = argv.remove as boolean;
  const userIDs: string[] = [];
  let nickname = '';

  switch (argv._.length) {
    case 0:
      break;
    case 1:
      userIDs.push(userIDFromString(argv._[0]));
      break;
    default:
      if (!inRemoveMode) nickname = argv._.pop() || '';
      argv._.forEach(str => userIDs.push(userIDFromString(str)));
  }
  return { durationInMinutes, inRemoveMode, nickname, userIDs };
}

function makeGuildMemberUpdateHandler(guild: Guild, nickname: string) {
  return async (_: GuildMember, newMember: GuildMember): Promise<void> => {
    if (guild.id === newMember.guild.id && newMember.nickname !== nickname) {
      await newMember.setNickname(nickname);
    }
  };
}

/** Nicknames a user — permanently. */
const permanick: Command = {
  name: 'permanick',
  usage: usage,
  allowedRole: 'Moderator',
  run: runPermanickCommand,
};

export default permanick;
