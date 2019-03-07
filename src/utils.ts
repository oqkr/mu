import { Guild, GuildMember, Role, User } from 'discord.js';

import { Command } from './command';

/** Get a random integer between two values, inclusive of both bounds. */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Returns true if a user has permission to run a given command. */
export function isAllowed(
  user: GuildMember | User,
  command: Command
): boolean {
  return user instanceof User
    ? isAllowedByUser(user, command)
    : isAllowedByRole(user, command) || isAllowedByUser(user, command);
}

/** TK */
function isAllowedByUser(
  user: GuildMember | User,
  command: Command
): boolean {
  const allowedUsers = command.allowedUsers || [];
  if (!allowedUsers.length && user instanceof User) return true;
  return allowedUsers.some((id: string) => user.id === id);
}

/** TK */
function isAllowedByRole(user: GuildMember, command: Command): boolean {
  const nameOrID = command.allowedRole || 'everyone';
  if (nameOrID === 'everyone') return true;
  if (user.id === user.guild.ownerID) return true;
  if (nameOrID === 'owner' && user.id !== user.guild.ownerID) return false;
  const role = user.guild.roles.find(
    (r: Role): boolean => r.id === nameOrID || r.name === nameOrID
  );
  if (!role) return false;
  return user.highestRole.comparePositionTo(role) >= 0;
}
