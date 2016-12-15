import { ORDER_STATES } from '../../../../constants/orders';

const defaults = {};

defaults.TOTAL = 0;
defaults._updated = null;
ORDER_STATES.forEach(val => { defaults[val.name] = 0; });

export const DEFAULTS = defaults;
