// A bug in tslint bug incorrectly flags regexp with dotAll flag set.
// tslint:disable:no-empty-character-class

import { Message } from 'discord.js';
import { get}  from 'got';

import { isNotOnlyWhitespace } from './utils';

/** Represents a Markdown code block (text surrounded by triple backticks). */
export default class CodeBlock {
  private constructor(readonly code: string, public language: string = '') {
    const reToParseLanguageLabelAndCode = /^([A-Za-z]+)(?:\n)(.+)/s;
    const match = reToParseLanguageLabelAndCode.exec(code);
    if (!(match && match[1] && match[2])) return;
    this.language = language || match[1];
    this.code = match[2];
  }

  static async fromDiscordMessage(
    message: Message,
    language: string = ''
  ): Promise<CodeBlock[]> {
    return [
      ...CodeBlock.fromDiscordMessageContent(message, language),
      ...(await CodeBlock.fromDiscordMessageAttachment(message, language)),
    ];
  }

  static async fromDiscordMessageAttachment(
    message: Message,
    language: string = ''
  ): Promise<CodeBlock[]> {
    if (!message.attachments.size) return [];
    const fileURLs = message.attachments
      // Images and videos have height and width, and we don't want them.
      .filter(a => a.filesize > 0 && !a.height && !a.width)
      .map(a => a.url);
    if (!fileURLs.length) return [];

    const contentsOfEachFile = await Promise.all(
      fileURLs.map(async fileURL => (await get(fileURL)).body)
    );
    return contentsOfEachFile
      .filter(isNotOnlyWhitespace)
      .map(contents => new CodeBlock(contents, language));
  }

  static fromDiscordMessageContent(
    message: Message,
    language: string = ''
  ): CodeBlock[] {
    const codeBlocks: CodeBlock[] = [];
    const reToParseCodeBlockFromMessage = /```(.*?)```/gs;
    let result: RegExpExecArray | null;
    do {
      result = reToParseCodeBlockFromMessage.exec(message.content);
      if (result) codeBlocks.push(new CodeBlock(result[1], language));
    } while (result);
    return codeBlocks;
  }

  toString(): string {
    return `\`\`\`${this.language}\n${this.code}\`\`\``;
  }
}
