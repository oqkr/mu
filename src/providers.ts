/** An interface for objects that can carry a conversation with a user. */
export interface ChatProvider {

  /** Returns a conversational response for its input. */
  chat(input: string): Promise<string>;
}
