/* @flow */
import { createAction } from 'redux-actions';
import isArray from 'lodash/isArray';

import { fetchJson } from '../../../utils';
import settings from '../../../../../settings';
import { error } from '../../../../ui/bubbles/actions';

const fetchOrders = createAction(
  'ORDERS_FETCHORDERS',
  async (
    id: number,
    fetchMore: boolean,
    offset: number,
    date: string,
    filter: string,
    limit: number,
    sortDir: boolean,
    sort: string,
    searchData: Object,
  ): Object => {
    let url;
    const status = !filter || filter === 'filter' ? '' : filter;

    if (!id || id === 'id') {
      url = `${settings.REST_BASE_URL}/orders?` +
      `ids=${searchData.ids || ''}&` +
      `date=${searchData.minDate}&` +
      `maxmodified=${searchData.maxDate || '29991231'}&` +
      `keyname=${searchData.keyName || ''}&` +
      `keyvalue=${searchData.keyValue || ''}&` +
      `status=${status}&` +
      `sort=${sort}&` +
      `desc=${sortDir.toString()}&` +
      `offset=${offset}&` +
      `limit=${limit}`;
    } else {
      url = `${settings.REST_BASE_URL}/orders?` +
      `workflowid=${id}&` +
      `date=${date}&` +
      `status=${status}&` +
      `sort=${sort}&` +
      `desc=${sortDir.toString()}&` +
      `offset=${offset}&` +
      `limit=${limit}`;
    }

    const orders: Array<Object> = await fetchJson(
      'GET',
      url,
      null,
      true
    );

    return { orders, fetchMore };
  }
);

const changeOffset = createAction('ORDERS_CHANGEOFFSET', (newOffset: number): Object => (
  { newOffset }
));
const changeServerSort = createAction('ORDERS_CHANGESERVERSORT', (sort: string): Object => (
  { sort }
));
const select = createAction(
  'ORDERS_SELECT',
  (id: number) => ({ id })
);
const selectAll = createAction('ORDERS_SELECTALL');
const selectNone = createAction('ORDERS_SELECTNONE');
const selectInvert = createAction('ORDERS_SELECTINVERT');
const unselectAll = createAction('ORDERS_UNSELECTALL');

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

const updateHierarchy: Function = createAction(
  'ORDERS_UPDATEHIERARCHY',
  async (id: number) => {
    const hierarchy: Object = await fetchJson(
      'GET',
      `${settings.REST_BASE_URL}/orders/${id}/HierarchyInfo`,
      null,
      true
    );

    return { id, hierarchy };
  }
);

const updateStepInstances: Function = createAction(
  'ORDERS_UPDATESTEPINSTANCES',
  async (id: number) => {
    const steps: Object = await fetchJson(
      'GET',
      `${settings.REST_BASE_URL}/orders/${id}/StepInstances`,
      null,
      true
    );

    return { id, steps };
  }
);

const updateErrors: Function = createAction(
  'ORDERS_UPDATEERRORS',
  async (id) => {
    const errors = await fetchJson(
      'GET',
      `${settings.REST_BASE_URL}/orders/${id}/ErrorInstances`,
      null,
      true
    );

    return { id, errors };
  }
);

const updateDone = createAction(
  'ORDERS_UPDATEDONE',
  (id: number) => ({ id })
);

const fetchData = createAction(
  'ORDERS_FETCHDATA',
  async (id: number, type: string) => {
    const data = type === 'dynamic' ? 'dynamicdata' : type;
    const newData = await fetchJson('GET', `${settings.REST_BASE_URL}/orders/${id}/${data}`);

    return {
      id,
      type: data,
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

    return { ids: id, result };
  }
);

const scheduleAction: Function = createAction(
  'ORDERS_SCHEDULE',
  async (
    id: number,
    date: string,
    optimistic: boolean,
    origStatus: string,
    dispatch: Function,
  ): Object => {
    if (optimistic) return { id, date };

    const result = await fetchJson(
      'PUT',
      `${settings.REST_BASE_URL}/orders/${id}?action=reschedule&date=${date}`,
      {},
      true
    );

    if (result.err) {
      dispatch(error(result.desc));
    }

    return {
      id,
      date,
      origStatus,
      error: result.err,
    };
  }
);

const priorityAction: Function = createAction(
  'ORDERS_SETPRIORITY',
  async (
    id: number,
    priority: number,
    optimistic: boolean,
    dispatch: Function,
  ): Object => {
    if (optimistic) return { id, priority };

    const result = await fetchJson(
      'PUT',
      `${settings.REST_BASE_URL}/orders/${id}?action=setPriority&priority=${priority}`,
      {},
      true
    );

    if (result.err) {
      dispatch(error(result.desc));
    }

    return {
      id,
      priority,
      error: result.err,
    };
  }
);

const action: Function = (
  actn: string,
  id: number,
): Function => (
  dispatch: Function
): void => {
  dispatch(orderAction(actn, id, true));
  dispatch(orderAction(actn, id, false, dispatch));
};

const schedule: Function = (
  id: number,
  date: string,
  origStatus: string,
): Function => (
  dispatch: Function
): void => {
  dispatch(scheduleAction(id, date, false, origStatus, dispatch));
  dispatch(scheduleAction(id, date, true));
};

const setPriority: Function = (
  id: number,
  priority: string,
): Function => (
  dispatch: Function
): void => {
  dispatch(priorityAction(id, priority, false, dispatch));
  dispatch(priorityAction(id, priority, true));
};

const lock: Function = createAction(
  'ORDERS_LOCK',
  (
    id: number,
    username: string,
    note: string,
    type: string,
  ): Object => {
    fetchJson(
      'PUT',
      `${settings.REST_BASE_URL}/orders/${id}`,
      {
        body: JSON.stringify({
          action: type,
          username,
          note,
        }),
      }
    );

    return { id, username, note, type };
  }
);

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

const updateData: Function = createAction(
  'ORDERS_UPDATEDATA',
  (
    type: string,
    newData: Object,
    id: number
  ): void => {
    const key: string = type === 'updateKeys' ? 'orderkeys' : 'newdata';

    fetchJson(
      'PUT',
      `${settings.REST_BASE_URL}/orders/${id}`,
      {
        body: JSON.stringify({
          action: type,
          [key]: newData,
        }),
      }
    );
  }
);

const unsync = createAction('ORDERS_UNSYNC');

export {
  addOrder,
  modifyOrder,
  addNoteWebsocket,
  updateDone,
  fetchData,
  updateData,
  unsync,
  action,
  orderAction,
  skipStep,
  schedule,
  scheduleAction,
  updateErrors,
  updateHierarchy,
  selectAll,
  selectNone,
  selectInvert,
  unselectAll,
  fetchOrders,
  changeOffset,
  changeServerSort,
  select,
  lock,
  setPriority,
  priorityAction,
  updateStepInstances,
};
