import { Guild, GuildMember } from 'discord.js';

export function convertMinimistArgToString(arg: unknown): string {
  // A bug in tslint incorrectly flags this line.
  // tslint:disable-next-line:strict-type-predicates
  if (typeof arg === 'undefined') {
    return '';
  } else if (typeof arg === 'string') {
    return arg;
  } else if (Object.getPrototypeOf(arg) === Array.prototype) {
    return convertMinimistArgToString((arg as unknown[]).pop());
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

/** Get a random integer between two values, inclusive of both bounds. */
export const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

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
