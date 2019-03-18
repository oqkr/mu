import { Message } from 'discord.js';
import { get } from 'got';

import Command from '../command/Command';
import { randomInt } from '../utils';

const usage = `
Usage: xkcd [ id | search_term | "latest" | "random" ]

Fetches the latest xkcd comic, a random xkcd comic, a specific xkcd comic by \
ID, or an xkcd comic by search term.

Without arguments, this fetches a random xkcd comic.

Examples:
  @mu xkcd "make me a sandwich"
  @mu xkcd 149
`;

/** Main entry point for xkcd command. */
async function run(message: Message, ...args: string[]): Promise<void> {
  const url = 'https://xkcd.com';
  const maxID = await mostRecentID();
  if (!args.length || args[0] === 'random') {
    await message.channel.send(`${url}/${randomInt(1, maxID)}`);
    return;
  }
  if (args.length === 1) {
    if (args[0] === 'latest') {
      await message.channel.send(url);
      return;
    }
    const id1 = parseInt(args[0], 10);
    if (Number.isInteger(id1)) {
      if (id1 < 1 || id1 > maxID) {
        await message.channel.send(`error: ID out of range 1 to ${maxID}`);
        return;
      }
      await message.channel.send(`${url}/${id1}`);
      return;
    }
  }
  // Nothing else worked, so try to use what we got as a search string.
  const id2 = await searchForComicID(args.join(' '));
  await message.channel.send(`${url}/${id2}`);
}

/** Returns the ID for the most recent XKCD comic. */
async function mostRecentID(): Promise<number> {
  const url = 'https://xkcd.com/info.0.json';
  const { body }: { body: { num?: number } } = await get(url, { json: true });
  if (body.num === undefined) {
    throw new Error(`no \`num\` key in JSON response from ${url}`);
  }
  return body.num;
}

/** Returns an ID for an XKCD comic based on a search string. */
async function searchForComicID(query: string): Promise<number> {
  const apiURL = new URL('https://relevantxkcd.appspot.com/process');
  apiURL.searchParams.set('action', 'xkcd');
  apiURL.searchParams.set('query', query);

  const { body } = await get(apiURL);
  if (!body) throw new Error(`empty response from ${apiURL}`);

  // The response text has this format:
  //
  //   0.1104
  //   0
  //   149 /wiki/images/b/b1/sandwich.png
  //   [more lines like this]
  //
  // The first line is a relevance score; the second line is unknown; and all
  // remaining lines are <id> <wiki-url>.
  const line = body.split(/\s*\n/)[2];
  if (!line) throw new Error(`no search results from ${apiURL}`);

  const str = line.split(' ')[0];
  if (!str) throw new Error(`no comic ID received from ${apiURL}`);

  const id = parseInt(str, 10);
  if (!id) throw new Error(`invalid comic ID received from ${apiURL}`);

  return id;
}

/** Fetches an xkcd comic by ID or by search term. */
const xkcd: Command = { name: 'xkcd', usage, run };

export default xkcd;
