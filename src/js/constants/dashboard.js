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
  A: 'stats.disposition-auto',
  M: 'stats.disposition-manual',
  C: 'stats.disposition-no-err',
};

export { HEALTH_KEYS, DISPOSITIONS };
