import SuperCommand from '../../command/SuperCommand';

import hastebin from './hastebin'

const usage = `
Usage: upload <service>
       upload help <service>

Uploads text or files using one of the registered services.
`;

/** Uploads text or files using one of the registered services. */
const upload = new SuperCommand({
  name: 'upload',
  usage: usage,
  subcommands: [hastebin],
});

export default upload;
