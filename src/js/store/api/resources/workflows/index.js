import { ORDER_STATES } from '../../../../constants/orders';

let defaults;

defaults = { TOTAL: 0 };

ORDER_STATES.forEach((val) => { defaults[val.name] = 0; });

export const DEFAULTS = defaults;
