/* @flow */
import { createAction } from 'redux-actions';

import { fetchJson } from '../../../utils';
import settings from '../../../../../settings';
import { error } from '../../../../ui/bubbles/actions';

const addOrder: Function = createAction(
  'ORDERS_ADDORDER',
  (order: Object, time: string) => ({ order, time })
);

const modifyOrder: Function = createAction(
  'ORDERS_MODIFYORDER',
  (id: number, status: string, modified: string) => ({ id, status, modified })
);

const addNoteWebsocket: Function = createAction(
  'ORDERS_ADDNOTEWEBSOCKET',
  (id: number, note: Object) => ({ id, note })
);

const updateDone = createAction(
  'ORDERS_UPDATEDONE',
  (id: number) => ({ id })
);

const fetchData = createAction(
  'ORDERS_FETCHDATA',
  async (id: number, type: string) => {
    const newData = await fetchJson('GET', `${settings.REST_BASE_URL}/orders/${id}/${type}`);

    return {
      id,
      type,
      data: newData,
    };
  }
);

const orderAction: Function = createAction(
  'ORDERS_ORDERACTION',
  async (
    actn: string,
    id: number,
    optimistic: boolean,
    origStatus: string,
    dispatch: Function
  ): ?Object => {
    if (optimistic) return { id, action: actn };

    const result = await fetchJson(
      'PUT',
      `${settings.REST_BASE_URL}/orders/${id}?action=${actn}`,
      {},
      true
    );

    if (result.err) {
      dispatch(error(result.desc));
    }

    return { id, origStatus, result };
  }
);

const action: Function = (
  actn: string,
  id: number,
  origStatus: string
): Function => (
  dispatch: Function
): void => {
  dispatch(orderAction(actn, id, false, origStatus, dispatch));
  dispatch(orderAction(actn, id, true));
};

const unsync = createAction('ORDERS_UNSYNC');

export {
  addOrder,
  modifyOrder,
  addNoteWebsocket,
  updateDone,
  fetchData,
  unsync,
  action,
  orderAction,
};
