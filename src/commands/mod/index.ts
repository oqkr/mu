import ModCommand from '../../command/ModCommand';

import ban from './ban';
import kick from './kick';
import permanick from './permanick';
import unban from './unban';
import warn from './warn';

const usage = `
Usage: mod <command>
       mod help <command>

Invokes one of the registered moderation commands.

Users must have moderator role or higher to access this.
`;

/** Invokes one of the registered moderation commands. */
const mod = new ModCommand({
  name: 'mod',
  usage: usage,
  subcommands: [ban, kick, permanick, unban, warn],
});

export default mod;
