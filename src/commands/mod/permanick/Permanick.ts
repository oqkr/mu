import * as discord from 'discord.js';

import { parseArgs, throwForInvalidArgs } from './args';

const stickyNicks: Map<UserID, StickyNick> = new Map();

type UserID = string;

type StickyNick = {
  handler: GuildMemberUpdateHandler;
  timeout?: NodeJS.Timeout;
};

type GuildMemberUpdateHandler = (
  oldMember: discord.GuildMember,
  newMember: discord.GuildMember
) => Promise<void>;

const eventName = 'guildMemberUpdate';

export default class Permanick {
  private readonly client: discord.Client;
  private readonly durationInMinutes: number;
  private readonly guild: discord.Guild;
  private readonly inRemoveMode: boolean;
  private readonly nickname: string;
  private readonly userIDs: string[];

  constructor(message: discord.Message, ...args: string[]) {
    const argv = parseArgs(...args);
    throwForInvalidArgs(argv);
    this.client = message.client;
    this.durationInMinutes = argv.durationInMinutes;
    this.guild = message.guild;
    this.inRemoveMode = argv.inRemoveMode;
    this.nickname = argv.nickname;
    this.userIDs = argv.userIDs;
  }

  async run(): Promise<void> {
    for (const userID of this.userIDs) {
      this.cancelExistingStickyNick(userID);
      if (this.inRemoveMode) {
        await this.removeNicknameForUser(userID);
        continue;
      }
      await this.setStickyNickForUser(userID);
    }
  }

  private cancelExistingStickyNick(userID: string): void {
    const stickyNick = stickyNicks.get(userID);
    if (!stickyNick) return;
    if (stickyNick.timeout) clearTimeout(stickyNick.timeout);
    this.client.off(eventName, stickyNick.handler);
    stickyNicks.delete(userID);
  }

  private makeGuildMemberUpdateHandler(): GuildMemberUpdateHandler {
    return async (_: discord.GuildMember, newMember: discord.GuildMember) => {
      const { guild: { id }, nickname } = this;
      if (newMember.guild.id === id && newMember.nickname !== nickname) {
        await newMember.setNickname(nickname);
      }
    };
  }

  private makeStickyNick(userID: string): StickyNick {
    const handler = this.makeGuildMemberUpdateHandler();
    this.client.on(eventName, handler);
    const timeout = this.startTimerToCancelStickyNick(userID, handler);
    return { handler, timeout };
  }

  private async removeNicknameForUser(userID: string): Promise<void> {
    return this.setNicknameForUser(userID, '');
  }

  private async setNicknameForUser(
    userID: string,
    nickname: string
  ): Promise<void> {
    const member = await this.guild.fetchMember(userID);
    await member.setNickname(nickname);
  }

  private async setStickyNickForUser(userID: string): Promise<void> {
    await this.setNicknameForUser(userID, this.nickname);
    const stickyNick = this.makeStickyNick(userID);
    stickyNicks.set(userID, stickyNick);
  }

  private startTimerToCancelStickyNick(
    userID: string,
    handler: GuildMemberUpdateHandler
  ): NodeJS.Timeout | undefined {
    if (!this.durationInMinutes) return undefined;
    const milliseconds = this.durationInMinutes * 60 * 1000;
    return setTimeout(async () => {
      this.client.off(eventName, handler);
      stickyNicks.delete(userID);
      await this.removeNicknameForUser(userID);
    }, milliseconds);
  }
}
