import log from '../log';

/**
 * Handles the ready event that indicates the bot is online and ready to work.
 * @returns True if the event is now considered handled.
 */
async function handleReady(): Promise<boolean> {
  log.success('Bot online and ready');
  return true;
}

export default handleReady;
