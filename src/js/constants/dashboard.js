import { Intent } from '@blueprintjs/core';

const HEALTH_KEYS = {
  YELLOW: Intent.WARNING,
  UNREACHABLE: Intent.DANGER,
  RED: Intent.DANGER,
  ERROR: Intent.DANGER,
  GREEN: Intent.SUCCESS,
};

export { HEALTH_KEYS };
