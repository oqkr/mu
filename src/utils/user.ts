import { Guild, GuildMember } from 'discord.js';

/**
 * Resolves a user mention to a user ID.
 *
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

/** Resolves a user ID or a user mention to a GuildMember. */
export async function guildMemberFromString(
  guild: Guild,
  mentionOrID: string
): Promise<GuildMember> {
  return guild.fetchMember(userIDFromString(mentionOrID));
}
