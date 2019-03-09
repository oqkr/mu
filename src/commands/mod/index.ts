import SuperCommand from '../../command/SuperCommand';

import ban from './ban';
import kick from './kick';
import unban from './unban';
import warn from './warn';

const usage = `
Usage: mod <command>
       mod help <command>

Invokes one of the registered moderation commands.

Users must have moderator role or higher to access this.
`;

const mod = new SuperCommand({
  name: 'mod',
  usage: usage,
  allowedRole: 'Moderator',
  subcommands: [ban, kick, unban, warn],
});

export default mod;
