import { Intent } from '@blueprintjs/core';

const intentTransform = {
  success: Intent.SUCCESS,
  danger: Intent.DANGER,
  info: Intent.PRIMARY,
  default: null,
  warning: Intent.WARNING,
  purple: 'purple',
};

const getIntentFromBsStyle = (bsStyle: string): string =>
  intentTransform[bsStyle];

export { getIntentFromBsStyle };
