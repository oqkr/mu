import { Guild, GuildMember } from 'discord.js';

export function convertMinimistArgToString(arg: unknown): string {
  // A bug in tslint incorrectly flags this line.
  // tslint:disable-next-line:strict-type-predicates
  if (typeof arg === 'undefined') {
    return '';
  } else if (typeof arg === 'string') {
    return arg;
  } else if (Array.isArray(arg)) {
    return convertMinimistArgToString(arg.pop());
  } else {
    throw new Error('arg is not a string or an array of strings');
  }
}

/** Resolves a user ID or a user mention to a GuildMember. */
export async function guildMemberFromString(
  guild: Guild,
  mentionOrID: string
): Promise<GuildMember> {
  return guild.fetchMember(userIDFromString(mentionOrID));
}

export function isNotOnlyWhitespace(str: string): boolean {
  return !isOnlyWhitespace(str);
}

export function isOnlyWhitespace(str: string): boolean {
  return /^\s*$/.test(str);
}

/** Get a random integer between two values, inclusive of both bounds. */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function stripTrailingSlash(str: string): string {
  return str.replace(/\/+$/, '');
}

/**
 * Resolves a user mention to a user ID.
 * (If input is already a user ID, this just returns it.)
 * @throws If mentionOrID cannot be converted to a well-formed user ID.
 */
export function userIDFromString(mentionOrID: string): string {
  const id = mentionOrID.replace(/[<@!>]/g, '');
  if (!/^\d{17,}$/.test(id)) {
    throw new Error(`invalid user ID \`${mentionOrID}\``);
  }
  return id;
}
