import { post } from 'got';

import { ChatProvider } from '../providers';

const baseURL = 'https://cleverbot.io/1.0';
const timeout = 60000; // 60 seconds

type Response = {
  body: {
    status: string;
    response?: string;
  };
};

/** A client for the Cleverbot.io API. */
class Cleverbot implements ChatProvider {
  private isReady: boolean = false;

  constructor(
    private readonly user: string,
    private readonly key: string,
    readonly sessionID: string = 'mu'
  ) {}

  /** Sends input to Cleverbot and returns the reply. */
  async chat(input: string): Promise<string> {
    if (!this.isReady) await this.init();

    const url = `${baseURL}/ask`;
    const {
      body: { status, response: responseText },
    }: Response = await post(url, {
      form: true,
      json: true,
      throwHttpErrors: false,
      timeout,
      body: {
        user: this.user,
        key: this.key,
        nick: this.sessionID,
        text: input,
      },
    });

    if (status !== 'success') {
      throw new Error(`cleverbot: ${url}: ${status}`);
    } else if (!responseText) {
      throw new Error(`cleverbot: ${url}: got empty response`);
    }
    return responseText;
  }

  /** Creates a chat session if it doesn't already exist. */
  private async init(): Promise<void> {
    const url = `${baseURL}/create`;
    const {
      body: { status },
    }: Response = await post(url, {
      form: true,
      json: true,
      throwHttpErrors: false,
      timeout,
      body: {
        user: this.user,
        key: this.key,
        nick: this.sessionID,
      },
    });

    if (
      status === 'success' ||
      status.startsWith('Error: reference name already exists')
    ) {
      this.isReady = true;
      return;
    }
    throw new Error(`cleverbot: ${url}: could not init session: ${status}`);
  }
}

export default Cleverbot;
