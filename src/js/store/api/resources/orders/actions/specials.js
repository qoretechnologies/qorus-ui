/* @flow */
import { createAction } from 'redux-actions';

import { fetchJson } from '../../../utils';
import settings from '../../../../../settings';

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

const unsync = createAction('ORDERS_UNSYNC');

export {
  addOrder,
  modifyOrder,
  addNoteWebsocket,
  updateDone,
  fetchData,
  unsync,
};
