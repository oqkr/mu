import { Signale } from 'signale';

/** Default logger used throughout Mu */
const log = new Signale();

log.config({
  displayDate: true,
  displayTimestamp: true,
  displayFilename: true,
});

export default log;
