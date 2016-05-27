import { ORDER_GROUPS } from 'constants/orders';

const groupOrders = (data) => {
  let result = Object.keys(ORDER_GROUPS);

  result = result.map(o => ORDER_GROUPS[o].reduce((total, g) => {
    const v = data[g] || 0;
    return total + v;
  }, 0));

  return result;
};

export {
  groupOrders,
};
