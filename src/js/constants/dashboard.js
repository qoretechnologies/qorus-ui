import { Intent } from '@blueprintjs/core';

const HEALTH_KEYS = {
  YELLOW: Intent.WARNING,
  UNKNOWN: Intent.WARNING,
  UNREACHABLE: Intent.NONE,
  RED: Intent.DANGER,
  ERROR: Intent.DANGER,
  GREEN: Intent.SUCCESS,
};

const DISPOSITIONS = {
  A: 'Recovered automatically',
  M: 'Recovered manually',
  C: 'Completed w/o errors',
};

export { HEALTH_KEYS, DISPOSITIONS };
