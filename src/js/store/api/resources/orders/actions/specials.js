/* @flow */
import { createAction } from 'redux-actions';
import isArray from 'lodash/isArray';

import { fetchJson } from '../../../utils';
import settings from '../../../../../settings';
import { error } from '../../../../ui/bubbles/actions';

const addOrder: Function = createAction(
  'ORDERS_ADDORDER',
  (events: Array<Object>) => ({ events })
);

const modifyOrder: Function = createAction(
  'ORDERS_MODIFYORDER',
  (events: Array<Object>) => ({ events })
);

const addNoteWebsocket: Function = createAction(
  'ORDERS_ADDNOTEWEBSOCKET',
  (events: Array<Object>) => ({ events })
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
    id: any,
    optimistic: boolean,
    origStatus: Object,
    dispatch: Function
  ): ?Object => {
    if (optimistic) return { ids: id, action: actn };

    const ids: string = isArray(id) ? id.join(',') : id;
    const result = await fetchJson(
      'PUT',
      `${settings.REST_BASE_URL}/orders?ids=${ids}&action=${actn}`,
      {},
      true
    );

    Object.keys(result).forEach((res: string): void => {
      if (typeof result[res] === 'string') {
        dispatch(error(result[res]));
      }
    });

    return { ids: id, origStatus, result };
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

const skipStep: Function = createAction(
  'ORDERS_SKIPSTEP',
  (
    orderId: number,
    stepid: number,
    ind: string,
    noretry: boolean
  ): Object => {
    fetchJson(
      'PUT',
      `${settings.REST_BASE_URL}/orders/${orderId}`,
      {
        body: JSON.stringify({
          action: 'skipStep',
          stepid,
          ind,
          noretry,
        }),
      }
    );

    return { orderId, stepid, ind };
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
  action,
  orderAction,
  skipStep,
};
