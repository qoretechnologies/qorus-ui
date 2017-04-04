/* @flow */
import { setUpdatedToNull } from '../../utils';
import { normalizeName } from '../utils';

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
    { payload: {
      orders,
      fetchMore,
    } } : {
      payload: Object,
      orders: Array<Object>,
      fetchMore: boolean,
    }
  ): Object {
    const data = [...state.data];
    const newData = fetchMore ? [...data, ...orders] : setUpdatedToNull(orders);
    const normalizedIds = newData.map((order: Object): Object => ({
      ...order,
      ...{
        id: order.workflow_instanceid,
      },
    }));
    const normalized = normalizedIds.map((order: Object): Object => normalizeName(order));

    return { ...state, ...{ data: normalized, loading: false, sync: true } };
  },
};

const changeOffset: Object = {
  next(state: Object = initialState, { payload: { newOffset } }: Object): Object {
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
