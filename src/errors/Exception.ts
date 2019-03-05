/** Base class for all custom errors in this package. */
export class Exception extends Error {
  constructor(...args: string[]) {
    super(...args);
    if (Error.captureStackTrace) Error.captureStackTrace(this, Exception);
  }
}

export default Exception;
