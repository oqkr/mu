import * as minimist from 'minimist';

import { convertMinimistArgToString, userIDFromString } from '../../../utils';

interface PositionalArgv {
  nickname: string;
  userIDs: string[];
}

interface Argv extends PositionalArgv {
  inRemoveMode: boolean;
  durationInMinutes: number;
}

function parseArgs(...args: string[]): Argv {
  const minimistArgv = minimist(args, {
    alias: { d: 'duration', r: 'remove' },
    default: { duration: '0', remove: false },
    string: ['d', 'duration', '_'],
    boolean: ['r', 'remove'],
  });
  const durationInMinutes = parseInt(
    convertMinimistArgToString(minimistArgv.duration),
    10
  );
  const inRemoveMode = minimistArgv.remove as boolean;
  const positionalArgv = parsePositionalArgs(inRemoveMode, ...minimistArgv._);
  return { durationInMinutes, inRemoveMode, ...positionalArgv };
}

function parsePositionalArgs(
  inRemoveMode: boolean,
  ...args: string[]
): PositionalArgv {
  const userIDs: string[] = [];
  let nickname = '';
  switch (args.length) {
    case 0:
      break;
    case 1:
      userIDs.push(userIDFromString(args[0]));
      break;
    default:
      if (!inRemoveMode) nickname = args.pop() || '';
      args.forEach(str => userIDs.push(userIDFromString(str)));
  }
  return { nickname, userIDs };
}

function throwForInvalidArgs(argv: Argv): void {
  if (!argv.userIDs.length) {
    throw new Error('no users specified');
  } else if (Number.isNaN(argv.durationInMinutes)) {
    throw new Error('duration is not a number');
  } else if (argv.durationInMinutes < 0) {
    throw new Error('minutes cannot be less than 0');
  } else if (!argv.inRemoveMode && !argv.nickname) {
    throw new Error('missing nickname argument');
  }
}

export { Argv, parseArgs, throwForInvalidArgs };
