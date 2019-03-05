import { Message } from 'discord.js';
import { get } from 'got';

import { Command } from '../command';

type APIResponse = { body: { url?: string } };

const apiURL = 'https://random.dog/woof.json';
const usage = `
Usage: dog

Gets the URL of a random dog image.
`;

/** Gets the URL of a random dog image. */
const dog: Command = {
  name: 'dog',
  usage,
  run: async (message: Message): Promise<void> => {
    const {
      body: { url: imageURL },
    }: APIResponse = await get(apiURL, {json: true});
    if (!imageURL) throw new Error(`no image in response from ${apiURL}`);
    await message.channel.send(imageURL);
  },
};

export default dog;
