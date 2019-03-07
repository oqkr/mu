/** Get a random integer between two values, inclusive of both bounds. */
export default function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
