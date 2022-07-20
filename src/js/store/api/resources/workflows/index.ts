import { ORDER_STATES } from '../../../../constants/orders';

const defaults = {};

// @ts-ignore ts-migrate(2339) FIXME: Property 'TOTAL' does not exist on type '{}'.
defaults.TOTAL = 0;
// @ts-ignore ts-migrate(2339) FIXME: Property '_updated' does not exist on type '{}'.
defaults._updated = null;
ORDER_STATES.forEach((val) => {
  defaults[val.name] = 0;
});

export const DEFAULTS = defaults;
