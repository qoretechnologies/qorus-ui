import { ORDER_ACTIONS } from '../constants/orders';

const getActionData = (action, prop) => {
  const actionData = ORDER_ACTIONS.ALL.find(a => a.action === action);

  return prop ? actionData[prop] : actionData;
};

export {
  getActionData,
};
