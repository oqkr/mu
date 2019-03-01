import { Message } from 'discord.js';
import { get } from 'got';

import Command from '../Command';

const apiURL = 'https://aws.random.cat/meow';

/** Shape of JSON-bearing response object from cat API. */
type Response = { body: { file?: string } };

/** Returns the URL of a random cat image. */
const cat: Command = {
  name: 'cat',
  run: async (message: Message): Promise<void> => {
    const {
      body: { file: imageURL },
    }: Response = await get(apiURL, { json: true });
    if (!imageURL) throw new Error(`no image in response from ${apiURL}`);
    await message.channel.send(imageURL);
  },
};

export default cat;
