import { Intent } from '@blueprintjs/core';

const HEALTH_KEYS = {
  YELLOW: Intent.WARNING,
  UNREACHABLE: Intent.DANGER,
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
