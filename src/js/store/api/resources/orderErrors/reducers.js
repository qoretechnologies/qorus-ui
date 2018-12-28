/* @flow */
import { setUpdatedToNull } from '../../utils';
import { normalizeName, normalizeId } from '../utils';

const initialState: Object = {
  data: [],
  sync: false,
  loading: false,
  offset: 0,
  limit: 50,
};

const fetchOrderErrors: Object = {
  next(
    state: Object,
    {
      payload: { orders, fetchMore },
    }: {
      payload: Object,
      orders: Array<Object>,
      fetchMore: boolean,
    }
  ): Object {
    const data = [...state.data];
    const newData = fetchMore ? [...data, ...orders] : setUpdatedToNull(orders);
    const normalized = newData
      .map((order: Object): Object => normalizeId('workflow_instanceid', order))
      .map((order: Object): Object => normalizeName(order, 'workflowid'));

    return { ...state, ...{ data: normalized, loading: false, sync: true } };
  },
};

const changeOffset: Object = {
  next(
    state: Object = initialState,
    {
      payload: { newOffset },
    }: Object
  ): Object {
    const offset = newOffset || newOffset === 0 ? newOffset : state.offset + 50;

    return { ...state, ...{ offset } };
  },
};

const unsync = {
  next() {
    return { ...initialState };
  },
};

export {
  fetchOrderErrors as FETCHORDERERRORS,
  changeOffset as CHANGEOFFSET,
  unsync as UNSYNC,
};
