import Axios from 'axios';
import { Message } from 'discord.js';

import Command from '../Command';

const url = 'https://aws.random.cat/meow';

/** Return the URL of a random cat image. */
const cat: Command = {
  name: 'cat',
  run: async (message: Message): Promise<void> => {
    const { data } = await Axios.get(url);
    if (!data.file) throw new Error(`no image in response from ${url}`);
    await message.channel.send(data.file);
  },
};

export default cat;
