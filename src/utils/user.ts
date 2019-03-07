import { Guild, GuildMember } from 'discord.js';

/**
 * Return a user ID from input string.
 * @param mention A user mention or user ID.
 * @example
 * // Get user from nickname mention (returns 123456789987654321).
 * userIDFromString(guild, '<@!123456789987654321>')
 */
export function userIDFromString(mention: string): string {
  return mention.replace(/[<@!>]/g, '');
}

/**
 * Return User from input string.
 * @param guild The guild to search in
 * @param mention A user mention or user ID.
 * @example
 * // Get user by nickname mention.
 * guildMemberFromString(guild, '<@!123456789987654321>');
 */
export async function guildMemberFromString(
  guild: Guild,
  mention: string
): Promise<GuildMember> {
  return guild.fetchMember(userIDFromString(mention));
}
