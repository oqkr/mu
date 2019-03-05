import { Message } from 'discord.js';
import { get } from 'got';

import { Command } from '../command';

type APIResponse = { body: { file?: string } };

const apiURL = 'https://aws.random.cat/meow';
const usage = `
Usage: cat

Gets the URL of a random cat image.
`;

/** Gets the URL of a random cat image. */
const cat: Command = {
  name: 'cat',
  usage,
  run: async (message: Message): Promise<void> => {
    const {
      body: { file: imageURL },
    }: APIResponse = await get(apiURL, { json: true });
    if (!imageURL) throw new Error(`no image in response from ${apiURL}`);
    await message.channel.send(imageURL);
  },
};

export default cat;
