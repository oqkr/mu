'use strict';

import axios from 'axios'

const url = 'https://aws.random.cat/meow';

// Return the URL of a random cat image.
module.exports = {
  name: 'cat',
  run: async message => {
    const { data } = await axios.get(url);
    if (!data.file) throw new Error(`no image in response from ${url}`);
    await message.channel.send(data.file);
  }
};
