import { ORDER_GROUPS } from 'constants/orders';
import { max, flatten } from 'lodash';

const groupOrders = (data) => {
  let result = Object.keys(ORDER_GROUPS);

  result = result.map(o => ORDER_GROUPS[o].reduce((total, g) => {
    const v = data[g] || 0;
    return total + v;
  }, 0));

  return result;
};

const getMaxValue = (data) => {
  const dataset = data.map(d => d.data);

  return max(flatten(dataset), (set) => set);
};

const getStepSize = (data) => {
  let maxValue = getMaxValue(data);

  if (maxValue > 60) {
    maxValue /= 60;
  }

  return Math.round(maxValue / 4);
};

export {
  groupOrders,
  getMaxValue,
  getStepSize,
};
