/* @flow */
import { setUpdatedToNull } from '../../utils';
import { normalizeId, normalizeName } from '../utils';

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
      // @ts-ignore ts-migrate(2339) FIXME: Property 'orders' does not exist on type 'Object'.
      payload: { orders, fetchMore },
    }: {
      payload: Object;
      orders: Array<Object>;
      fetchMore: boolean;
    }
  ): Object {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
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
      // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      payload: { newOffset },
    }: Object
  ): Object {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'offset' does not exist on type 'Object'.
    const offset = newOffset || newOffset === 0 ? newOffset : state.offset + 50;

    return { ...state, ...{ offset } };
  },
};

const unsync = {
  next() {
    return { ...initialState };
  },
};

export { fetchOrderErrors as FETCHORDERERRORS, changeOffset as CHANGEOFFSET, unsync as UNSYNC };
