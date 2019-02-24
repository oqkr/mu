'use strict';

const { JSDOM } = require('jsdom');

const url = 'https://random.cat';

// Return the URL of a random cat image.
module.exports = {
  name: 'cat',
  run: async msg => {
    const dom = await JSDOM.fromURL(url);
    const img = dom.window.document.querySelector('#cat');
    if (!img || !img.src) throw new Error(`no image in response from ${url}`);
    await msg.channel.send(img.src);
  }
};
