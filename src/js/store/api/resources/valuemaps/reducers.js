import { updateItemWithId } from '../../utils';

const fetchValues = {
  next(state: Object, { payload: { values, id } }) {
    const data = state.data.slice();
    const valuemap: Object = state.data.find((vm: Object): boolean => vm.id === parseInt(id, 10));
    const vals = valuemap.vals || { sync: true, loading: false, data: [] };
    vals.data = values;

    const newData = updateItemWithId(id, { vals }, data);

    return { ...state, ...{ data: newData } };
  },
};

const addValue = {
  next(state: Object, { payload: { id, key, value, enabled } }) {
    const data: Array<Object> = state.data.slice();
    const valuemap: Object = state.data.find((vm: Object): boolean => vm.id === parseInt(id, 10));
    const newValsData = { ...valuemap.vals.data, ...{ [key]: { value, enabled } } };
    const vals = { ...valuemap.vals, ...{ data: newValsData } };
    const newData = updateItemWithId(id, { vals }, data);

    return { ...state, ...{ data: newData } };
  },
};

const updateValue = {
  next(state: Object, { payload: { id, key, value, enabled } }) {
    const data: Array<Object> = state.data.slice();
    const valuemap: Object = state.data.find((vm: Object): boolean => vm.id === parseInt(id, 10));
    const newValues = { ...valuemap.vals.data[key], ...{ enabled, value } };
    const newValuesData = { ...valuemap.vals.data, ...{ [key]: newValues } };
    const vals = { ...valuemap.vals, ...{ data: newValuesData } };
    const newData = updateItemWithId(id, { vals }, data);

    return { ...state, ...{ data: newData } };
  },
};

const deleteValue = {
  next(state: Object, { payload: { id, key } }) {
    const data: Array<Object> = state.data.slice();
    const valuemap: Object = state.data.find((vm: Object): boolean => vm.id === parseInt(id, 10));
    const newValuesData = { ...valuemap.vals.data };

    delete newValuesData[key];

    const vals = { ...valuemap.vals, ...{ data: newValuesData } };
    const newData = updateItemWithId(id, { vals }, data);

    return { ...state, ...{ data: newData } };
  },
};

const getDump = {
  next(state: Object, { payload: { dump, id } }) {
    const data = state.data.slice();
    const newData = updateItemWithId(id, { dump }, data);

    return { ...state, ...{ data: newData } };
  },
};

const removeDump = {
  next(state: Object, { payload }) {
    const data = [...state.data];
    const newData = updateItemWithId(payload, { dump: null }, data);

    return { ...state, ...{ data: newData } };
  },
};

export {
  fetchValues as FETCHVALUES,
  addValue as ADDVALUE,
  updateValue as UPDATEVALUE,
  deleteValue as DELETEVALUE,
  getDump as GETDUMP,
  removeDump as REMOVEDUMP,
};
