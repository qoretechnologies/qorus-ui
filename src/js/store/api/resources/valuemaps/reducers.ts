import { updateItemWithId } from '../../utils';

const fetchValues = {
  next(state: any, { payload: { values, id } }) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = state.data.slice();
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const valuemap: any = state.data.find((vm: any): boolean => vm.id === parseInt(id, 10));
    // @ts-ignore ts-migrate(2339) FIXME: Property 'vals' does not exist on type 'Object'.
    const vals = valuemap.vals || { sync: true, loading: false, data: [] };
    vals.data = values;

    const newData = updateItemWithId(id, { vals }, data);

    return { ...state, ...{ data: newData } };
  },
};

const addValue = {
  next(state: any, { payload: { id, key, value, enabled } }) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data: Array<Object> = state.data.slice();
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const valuemap: any = state.data.find((vm: any): boolean => vm.id === parseInt(id, 10));
    // @ts-ignore ts-migrate(2339) FIXME: Property 'vals' does not exist on type 'Object'.
    const newValsData = { ...valuemap.vals.data, ...{ [key]: { value, enabled } } };
    // @ts-ignore ts-migrate(2339) FIXME: Property 'vals' does not exist on type 'Object'.
    const vals = { ...valuemap.vals, ...{ data: newValsData } };
    const newData = updateItemWithId(id, { vals }, data);

    return { ...state, ...{ data: newData } };
  },
};

const updateValue = {
  next(state: any, { payload: { id, key, value, enabled } }) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data: Array<Object> = state.data.slice();
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const valuemap: any = state.data.find((vm: any): boolean => vm.id === parseInt(id, 10));
    // @ts-ignore ts-migrate(2339) FIXME: Property 'vals' does not exist on type 'Object'.
    const newValues = { ...valuemap.vals.data[key], ...{ enabled, value } };
    // @ts-ignore ts-migrate(2339) FIXME: Property 'vals' does not exist on type 'Object'.
    const newValuesData = { ...valuemap.vals.data, ...{ [key]: newValues } };
    // @ts-ignore ts-migrate(2339) FIXME: Property 'vals' does not exist on type 'Object'.
    const vals = { ...valuemap.vals, ...{ data: newValuesData } };
    const newData = updateItemWithId(id, { vals }, data);

    return { ...state, ...{ data: newData } };
  },
};

const deleteValue = {
  next(state: any, { payload: { id, key } }) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data: Array<Object> = state.data.slice();
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const valuemap: any = state.data.find((vm: any): boolean => vm.id === parseInt(id, 10));
    // @ts-ignore ts-migrate(2339) FIXME: Property 'vals' does not exist on type 'Object'.
    const newValuesData = { ...valuemap.vals.data };

    delete newValuesData[key];

    // @ts-ignore ts-migrate(2339) FIXME: Property 'vals' does not exist on type 'Object'.
    const vals = { ...valuemap.vals, ...{ data: newValuesData } };
    const newData = updateItemWithId(id, { vals }, data);

    return { ...state, ...{ data: newData } };
  },
};

const getDump = {
  next(state: any, { payload: { dump, id } }) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = state.data.slice();
    const newData = updateItemWithId(id, { dump }, data);

    return { ...state, ...{ data: newData } };
  },
};

const removeDump = {
  next(state: any, { payload }) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
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
