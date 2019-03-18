import { Message } from 'discord.js';
import { post } from 'got';
import * as minimist from 'minimist';

import CodeBlock from '../../CodeBlock';
import Command from '../../command/Command';
import { convertMinimistArgToString, stripTrailingSlash } from '../../utils';

// We use zero-width spaces to separate triple backticks in the Example section
// because the current help command already wraps usage messages in a code
// block and there's no way to escape triple backticks in a code block.
const usage = `
Usage: upload hastebin [options] [codeblock...]

Uploads a code block to a hastebin service and posts the link.

Code can also be sent directly as file attachments.

If multiple code blocks or file attachments are sent in one message, a new \
link is generated for each one.

With the \`--url\` option, any service that implements the hastebin API \
can be used (e.g., a self-hosted hastebin server).

Options:
  -l, --language string  Set this language for all code blocks or files.
  -u, --url string       A hastebin service URL (default: https://hasteb.in)

Examples:
  @mu upload hastebin
  \`​\`​\`​javascript
  console.log('hello, world');
  \`​\`​\`​

  @mu upload hastebin --language python \`​\`​\`​print('hello, world')\`​\`​\`​
`;

async function runHastebinCommand(message: Message, ...args: string[]) {
  const argv = minimist(args, {
    alias: { l: 'language', u: 'url' },
    default: { url: 'https://hasteb.in' },
    string: ['l', 'language', 'u', 'url', '_'],
  });
  const language = convertMinimistArgToString(argv.language);
  const hastebinURL = stripTrailingSlash(convertMinimistArgToString(argv.url));
  const codeBlocks = await CodeBlock.fromDiscordMessage(message, language);
  if (!codeBlocks.length) throw new Error('hastebin: no code blocks or files');
  const urlsOfUploadedFiles = await Promise.all(
    codeBlocks.map(async codeBlock =>
      uploadToHastebinAndGetURL(hastebinURL, codeBlock)
    )
  );
  await message.channel.send(urlsOfUploadedFiles.join('\n'));
}

async function uploadToHastebinAndGetURL(
  hastebinURL: string,
  codeBlock: CodeBlock
): Promise<string> {
  const { body } = await post(`${hastebinURL}/documents`, {
    timeout: 60000, // 60 seconds
    body: codeBlock.code,
  });
  const { key: filename } = JSON.parse(body) as { key?: string };
  if (!filename) throw new Error('hastebin: no filename in API response');
  return codeBlock.language
    ? `${hastebinURL}/${filename}.${codeBlock.language}`
    : `${hastebinURL}/${filename}`;
}

/** Uploads a code block to a hastebin service and posts the link. */
const hastebin: Command = {
  name: 'hastebin',
  usage: usage,
  run: runHastebinCommand,
};

export default hastebin;
