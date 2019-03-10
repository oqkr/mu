/** An interface for objects that can carry a converstation with a user. */
export interface ChatProvider {

  /** Returns a conversational response for its input. */
  chat(input: string): Promise<string>;
}
