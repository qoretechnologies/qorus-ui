/* @flow */
const getResourceData: Function = (store: Object, resource: string): Array<Object> => (
  store.getState().api[resource].data
);

const getItem: Function = (
  store: Object,
  resource: string,
  value: string | number,
  key: string = 'id'
) => (
  getResourceData(store, resource).find(item => item[key] === value)
);

export {
  getResourceData,
  getItem,
};
