import { GuildMember, Role, User } from 'discord.js';

import Command from './command/Command';

/**
 * Returns true if a user has permission to run a given command.
 *
 * Permissions are checked and applied as follows:
 *  - If this is a guild channel (message type is "text"):
 *    - **Allow** if command.allowedRole is unset, empty, or "everyone".
 *    - **Allow** if user's role matches command.allowedRole.
 *    - Otherwise, check command.allowedUsers:
 *      - **Deny** if command.allowedUsers is empty.
 *      - **Allow** if user ID matches one of the IDs in command.allowedUsers.
 *      - **Deny** otherwise.
 *  - If this is a DM or group DM:
 *    - **Allow** if command.allowedUsers is empty.
 *    - **Allow** if user ID matches one of the IDs in command.allowedUsers.
 *    - **Deny** otherwise.
 */
export default function isAllowed(
  user: GuildMember | User,
  command: Command
): boolean {
  // If user is type User, this is a DM.
  return user instanceof User
    ? isAllowedByUser(user, command)
    : isAllowedByRole(user, command) || isAllowedByUser(user, command);
}

/**
 * Returns true if user has permission to run a command considering only the
 * allowedUsers field of the command.
 */
function isAllowedByUser(user: GuildMember | User, command: Command): boolean {
  const allowedUsers = command.allowedUsers || [];

  // If this is a DM, an empty allowedUsers means "allow anyone."
  if (!allowedUsers.length && user instanceof User) return true;
  return allowedUsers.some((id: string): boolean => user.id === id);
}

/**
 * Returns true if user has permission to run a command considering only the
 * allowedRole field of the command.
 */
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
