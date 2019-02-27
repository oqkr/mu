import { Signale } from 'signale';

const log = new Signale();

log.config({
  displayDate: true,
  displayTimestamp: true,
  displayFilename: true,
});

export default log;
