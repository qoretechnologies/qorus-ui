/* @flow */
import { createAction } from 'redux-actions';
import isArray from 'lodash/isArray';
import jsyaml from 'js-yaml';

import {
  fetchJson,
  fetchYaml,
  fetchWithNotifications,
  post,
  get,
  put,
} from '../../../utils';
import settings from '../../../../../settings';

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
    searchData: Object
  ): Object => {
    let url: string;
    const status: string = !filter || filter === 'filter' ? '' : filter;

    if (!id || id === 'id') {
      const maxDate: string = searchData.maxDate || '29991231';
      const sendDate: boolean = !(searchData.ids || searchData.keyValue);

      url =
        `${settings.REST_BASE_URL}/orders?` +
        `ids=${searchData.ids || ''}&` +
        `date=${!sendDate ? '' : searchData.minDate}&` +
        `maxmodified=${!sendDate ? '' : maxDate}&` +
        `keyname=${searchData.keyName || ''}&` +
        `keyvalue=${searchData.keyValue || ''}&` +
        `status=${status}&` +
        `sort=${sort}&` +
        `desc=${sortDir.toString()}&` +
        `offset=${offset}&` +
        `limit=${limit}`;
    } else {
      url =
        `${settings.REST_BASE_URL}/orders?` +
        `workflowid=${id}&` +
        `date=${date}&` +
        `status=${status}&` +
        `sort=${sort}&` +
        `desc=${sortDir.toString()}&` +
        `offset=${offset}&` +
        `limit=${limit}`;
    }

    const orders: Array<Object> = await fetchJson('GET', url, null, true);

    return { orders, fetchMore };
  }
);

const changeOffset = createAction(
  'ORDERS_CHANGEOFFSET',
  (newOffset: number): Object => ({ newOffset })
);
const changeServerSort = createAction(
  'ORDERS_CHANGESERVERSORT',
  (sort: string): Object => ({ sort })
);
const select = createAction('ORDERS_SELECT', (id: number) => ({ id }));
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
    const hierarchy: Object = await get(
      `${settings.REST_BASE_URL}/orders/${id}/HierarchyInfo`
    );

    if (hierarchy.err) {
      return { error: true };
    }

    return { id, hierarchy };
  }
);

const updateStepInstances: Function = createAction(
  'ORDERS_UPDATESTEPINSTANCES',
  async (id: number) => {
    const steps: Object = await get(
      `${settings.REST_BASE_URL}/orders/${id}/StepInstances`
    );

    if (steps.err) {
      return { error: true };
    }

    return { id, steps };
  }
);

const updateErrors: Function = createAction('ORDERS_UPDATEERRORS', async id => {
  const errors = await fetchJson(
    'GET',
    `${settings.REST_BASE_URL}/orders/${id}/ErrorInstances`,
    null,
    true
  );

  return { id, errors };
});

const updateDone = createAction('ORDERS_UPDATEDONE', (id: number) => ({ id }));

const fetchData = createAction(
  'ORDERS_FETCHDATA',
  async (id: number, type: string) => {
    const data =
      type === 'dynamic'
        ? 'dynamicdata'
        : type === 'sensitive'
          ? 'sensitive_data'
          : type;
    const newData = await fetchJson(
      'GET',
      `${settings.REST_BASE_URL}/orders/${id}/${data}`
    );

    return {
      id,
      type: data,
      data: newData,
    };
  }
);

const action: Function = createAction(
  'ORDERS_ORDERACTION',
  async (actn: string, id: any, dispatch: Function): ?Object => {
    if (!dispatch) return { ids: id, action: actn };

    const ids: string = isArray(id) ? id.join(',') : id;

    const result = await fetchWithNotifications(
      async () =>
        await fetchJson(
          'PUT',
          `${settings.REST_BASE_URL}/orders?ids=${ids}&action=${actn}`
        ),
      `Executing ${actn} for order(s) ${ids}`,
      `${actn} executed on order(s) for ${ids}`,
      dispatch
    );

    return {
      ids: id,
      result,
    };
  }
);

const schedule: Function = createAction(
  'ORDERS_SCHEDULE',
  async (
    id: number,
    date: string,
    origStatus: string,
    dispatch: Function
  ): Object => {
    if (!dispatch) return { id, date };

    await fetchWithNotifications(
      async () =>
        await fetchJson(
          'PUT',
          `${
            settings.REST_BASE_URL
          }/orders/${id}?action=reschedule&date=${date}`
        ),
      `Rescheduling order ${id}`,
      `Order ${id} rescheduled`,
      dispatch
    );

    return {
      id,
      date,
      origStatus,
    };
  }
);

const setPriority: Function = createAction(
  'ORDERS_SETPRIORITY',
  async (id: number, priority: number, dispatch: Function): Object => {
    if (!dispatch) return { id, priority };

    await fetchWithNotifications(
      async () =>
        await fetchJson(
          'PUT',
          `${
            settings.REST_BASE_URL
          }/orders/${id}?action=setPriority&priority=${priority}`
        ),
      `Setting priority for order ${id}`,
      `Priority set for order ${id}`,
      dispatch
    );

    return {
      id,
      priority,
    };
  }
);

const lockWs: Function = createAction('ORDERS_LOCKWS', events => ({ events }));
const lock: Function = createAction(
  'ORDERS_LOCK',
  (
    id: number,
    username: string,
    note: string,
    type: string,
    dispatch: Function
  ): Object => {
    fetchWithNotifications(
      async () =>
        await fetchJson('PUT', `${settings.REST_BASE_URL}/orders/${id}`, {
          body: JSON.stringify({
            action: type,
            username,
            note,
          }),
        }),
      `${type === 'lock' ? 'Locking' : 'Unlocking'} order ${id}`,
      `Order ${id} ${type === 'lock' ? 'locked' : 'unlocked'}`,
      dispatch
    );
  }
);

const skipStep: Function = createAction(
  'ORDERS_SKIPSTEP',
  (
    orderId: number,
    stepid: number,
    ind: string,
    noretry: boolean,
    dispatch: Function
  ): Object => {
    fetchWithNotifications(
      async () =>
        await fetchJson('PUT', `${settings.REST_BASE_URL}/orders/${orderId}`, {
          body: JSON.stringify({
            action: 'skipStep',
            stepid,
            ind,
            noretry,
          }),
        }),
      `Skipping step ${stepid} on order ${orderId}`,
      `Step ${stepid} skipped successfuly on order ${orderId}`,
      dispatch
    );

    return { orderId, stepid, ind };
  }
);

const updateData: Function = createAction(
  'ORDERS_UPDATEDATA',
  (
    type: string,
    newdata: string,
    id: number,
    skey: string,
    svalue: string
  ): void => {
    if (type === 'Keys') {
      fetchJson(
        'PUT',
        `${settings.REST_BASE_URL}/orders/${id}?action=updateKeys`,
        {
          body: JSON.stringify({
            orderkeys: JSON.parse(newdata),
          }),
        }
      );
    } else if (type === 'Sensitive') {
      const parsedData = JSON.parse(newdata);

      fetchJson(
        'PUT',
        `${settings.REST_BASE_URL}/orders/${id}?action=yamlSensitiveData`,
        {
          body: JSON.stringify({
            skey,
            svalue,
            ...parsedData,
          }),
        }
      );
    } else {
      fetchYaml(
        'PUT',
        `${settings.REST_BASE_URL}/orders/${id}?action=yaml${type}Data`,
        {
          body: JSON.stringify({
            newdata,
          }),
        }
      );
    }
  }
);

const updateSensitiveData: Function = createAction(
  'ORDERS_UPDATESENSITIVEDATA',
  (
    newdata: string,
    id: number,
    skey: string,
    svalue: string,
    onSuccess: Function,
    dispatch: Function
  ): Object => {
    const parsedData = jsyaml.safeLoad(newdata);

    fetchWithNotifications(
      async () => {
        const res = await put(
          `${settings.REST_BASE_URL}/orders/${id}?action=yamlSensitiveData`,
          {
            body: JSON.stringify({
              skey,
              svalue,
              ...parsedData,
            }),
          }
        );

        if (!res.err) {
          onSuccess();
        }

        return res;
      },
      'Updating sensitive data...',
      'Sensitive data successfuly updated!',
      dispatch
    );
  }
);

const fetchStepData: Function = createAction(
  'ORDERS_FETCHSTEPDATA',
  async (id: number): Object => {
    const stepData: Object = await get(
      `${settings.REST_BASE_URL}/orders/${id}/stepdata`
    );

    if (stepData.err) {
      return {
        stepData: null,
      };
    }

    return {
      id,
      stepData,
    };
  }
);

const fetchYamlAction: Function = createAction(
  'ORDERS_FETCHYAMLACTION',
  async (type: string, id: number): Object => {
    const result: Object = await fetchYaml(
      'GET',
      `${settings.REST_BASE_URL}/orders/${id}?action=yaml${type}Data`,
      null,
      false,
      true,
      true
    );

    return {
      type,
      id,
      yamlData: result,
    };
  }
);

const fetchYamlData: Function = (type: string, id: number): Function => (
  dispatch: Function
): void => {
  dispatch(fetchYamlAction(type, id, dispatch));
};

const addNote: Function = createAction(
  'ORDERS_ADDNOTE',
  (id: number, note: string, username: string, dispatch: Function): void => {
    fetchWithNotifications(
      async () =>
        await post(`${settings.REST_BASE_URL}/orders/${id}?action=notes`, {
          body: JSON.stringify({
            note,
            username,
          }),
        }),
      'Adding note...',
      'Note successfuly added',
      dispatch
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
  skipStep,
  schedule,
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
  lockWs,
  setPriority,
  updateStepInstances,
  fetchYamlData,
  fetchYamlAction,
  updateSensitiveData,
  addNote,
  fetchStepData,
};
