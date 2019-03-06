import { GuildMember, Role } from 'discord.js';

import { Command } from './command';

/** Get a random integer between two values, inclusive of both bounds. */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Returns true if a user has permision to run a given command. */
export function allowedToUse(user: GuildMember, command: Command): boolean {
  const roleNameOrID = command.allowedBy || 'everyone';
  if (roleNameOrID === 'everyone') return true;

  if (user.id === user.guild.ownerID) return true;
  if (roleNameOrID === 'owner' && user.id !== user.guild.ownerID) return false;

  const role = user.guild.roles.find(
    (r: Role): boolean => r.id === roleNameOrID || r.name === roleNameOrID
  );
  if (!role) return false;

  return user.highestRole.comparePositionTo(role) >= 0;
}
