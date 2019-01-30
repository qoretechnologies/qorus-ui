/* @flow */
import isArray from 'lodash/isArray';
import jsYaml from 'js-yaml';

import { updateItemWithId, setUpdatedToNull } from '../../utils';
import { normalizeName } from '../utils';
import { skipIndexes } from './actions/helpers';

const initialState: Object = {
  data: [],
  sync: false,
  loading: false,
  offset: 0,
  limit: 50,
  sort: 'started',
  sortDir: true,
};

const fetchOrders: Object = {
  next (
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
    const normalizedIds = newData.map(
      (order: Object): Object => ({
        ...order,
        ...{
          id: order.workflow_instanceid,
        },
      })
    );
    const normalized = normalizedIds.map(
      (order: Object): Object => normalizeName(order, 'workflowid')
    );

    return { ...state, ...{ data: normalized, loading: false, sync: true } };
  },
};

const changeOffset: Object = {
  next (
    state: Object = initialState,
    {
      payload: { newOffset },
    }: Object
  ): Object {
    const offset = newOffset || newOffset === 0 ? newOffset : state.offset + 50;

    return { ...state, ...{ offset } };
  },
};

const changeServerSort: Object = {
  next (
    state: Object = initialState,
    {
      payload: { sort },
    }: Object
  ): Object {
    const sortDir = state.sort === sort ? !state.sortDir : state.sortDir;

    return { ...state, ...{ offset: 0, sort, sortDir } };
  },
};

const selectOrder: Object = {
  next (
    state = initialState,
    {
      payload: { id },
    }
  ) {
    const stateData = [...state.data];
    const order = stateData.find((ord: Object) => ord.id === parseInt(id, 10));

    if (order) {
      const newData = updateItemWithId(
        id,
        { _selected: !order._selected },
        stateData
      );

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

const selectAll = {
  next (state: Object = initialState) {
    const data = [...state.data];
    const newData = data.map(w => ({ ...w, ...{ _selected: true } }));

    return { ...state, ...{ data: newData } };
  },
};

const selectNone = {
  next (state: Object = initialState) {
    const data = [...state.data];
    const newData = data.map(w => {
      const copy = { ...w };

      if (w._selected) {
        copy._selected = null;
      }

      return copy;
    });

    return { ...state, ...{ data: newData } };
  },
};

const selectInvert = {
  next (state: Object = initialState) {
    const data = [...state.data];
    const newData = data.map(w => ({ ...w, ...{ _selected: !w._selected } }));

    return { ...state, ...{ data: newData } };
  },
};

const unselectAll = {
  next (state: Object) {
    const data = [...state.data];
    const newData = data.map(w =>
      w._selected
        ? {
          ...w,
          ...{ _selected: false },
        }
        : w
    );

    return { ...state, ...{ data: newData } };
  },
};

const addOrder: Object = {
  next (
    state: Object = initialState,
    {
      payload: { events },
    }: { payload: Object, events: Array<Object> }
  ): Object {
    if (state.sync) {
      const data = [...state.data];
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach(
        (obj: Object): void => {
          const normalized = normalizeName({
            ...obj.info,
            ...{ id: obj.info.workflow_instanceid },
          });

          newData = [
            {
              ...normalized,
              ...{
                _updated: true,
                started: obj.time,
                workflowstatus: obj.info.status,
                note_count: 0,
              },
            },
            ...newData,
          ];
        }
      );

      const reducedData: Array<Object> = newData.slice(
        0,
        state.offset + state.limit
      );

      return { ...state, ...{ data: reducedData } };
    }

    return state;
  },
  throw (state: Object = initialState, action: Object): Object {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      error: action.payload,
    });
  },
};

const modifyOrder: Object = {
  next (
    state: Object = initialState,
    {
      payload: { events },
    }: {
      payload: Object,
      events: Array<Object>,
    }
  ): Object {
    if (state.sync) {
      const data = [...state.data];
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach(
        (dt: Object): void => {
          newData = updateItemWithId(
            dt.id,
            {
              workflowstatus: dt.new,
              modified: dt.time,
              _updated: true,
            },
            newData
          );
        }
      );

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw (state: Object = initialState, action: Object): Object {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      error: action.payload,
    });
  },
};

const addNote = {
  next (state) {
    return state;
  },
};

const addNoteWebsocket = {
  next (
    state: Object = initialState,
    {
      payload: { events },
    }: { payload: Object, events: Array<Object> }
  ): Object {
    if (state.data.length) {
      const data = state.data.slice();
      let newData = data;

      events.forEach(
        (dt: Object): void => {
          const order = newData.find(d => d.id === dt.id);
          const notes = [...order.notes, dt.note];
          const noteCount = order.note_count + 1;
          newData = updateItemWithId(
            dt.id,
            { notes, note_count: noteCount },
            newData
          );
        }
      );

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw (state: Object = initialState, action: Object): Object {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      error: action.payload,
    });
  },
};

const updateDone = {
  next (
    state: Object,
    {
      payload: { id },
    }: { payload: Object, id: number }
  ) {
    if (state.sync) {
      const data: Array<Object> = state.data.slice();
      const newData: Array<Object> = updateItemWithId(
        id,
        { _updated: null },
        data
      );

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw (state: Object, action: Object) {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      error: action.payload,
    });
  },
};

const fetchData: Object = {
  next (
    state: Object,
    {
      payload: { id, type, data },
    }: {
      payload: Object,
      id: number,
      type: string,
      data: Object,
    }
  ): Object {
    const dt = [...state.data];
    const newData = updateItemWithId(id, { [type]: data }, dt);

    return { ...state, ...{ data: newData } };
  },
  throw (state: Object, action: Object) {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      error: action.payload,
    });
  },
};

const orderAction: Object = {
  next (
    state: Object,
    {
      payload: { ids, action, result },
    }: Object
  ) {
    const data = [...state.data];
    let newData = data;

    if (result) {
      Object.keys(result).forEach(
        (res: string): void => {
          if (typeof result[res] === 'string') {
            const ord = newData.find(
              (order: Object): boolean => order.id === parseInt(res, 10)
            );

            newData = updateItemWithId(
              parseInt(res, 10),
              { workflowstatus: ord ? ord._originalStatus : null },
              newData
            );
          }
        }
      );
    } else {
      const orders: Array<number> = isArray(ids) ? ids : [ids];

      orders.forEach(
        (id: number): void => {
          const ord = newData.find(
            (order: Object): boolean => order.id === parseInt(id, 10)
          );

          const origStatus = ord ? ord.workflowstatus : '';

          newData = updateItemWithId(
            id,
            {
              workflowstatus: `${action.toUpperCase()}ING`,
              _originalStatus: origStatus,
            },
            newData
          );
        }
      );
    }

    return { ...state, ...{ data: newData } };
  },
};

const skipStep: Object = {
  next (
    state: Object,
    {
      payload: { orderId, stepid, ind },
    }: {
      payload: Object,
      orderId: number,
      stepid: number,
      ind: string,
    }
  ): Object {
    const data = [...state.data];
    const order: ?Object = data.find(
      (ord: Object): boolean => ord.id === orderId
    );
    const newInstances = skipIndexes(order, stepid, ind);
    const newData = updateItemWithId(
      orderId,
      { StepInstances: newInstances },
      data
    );

    return { ...state, ...{ data: newData } };
  },
};

const schedule: Object = {
  next (
    state: Object,
    {
      payload: { id, date, error, origStatus },
    }: {
      payload: Object,
      id: number,
      date: string,
      error: boolean,
      origStatus: string,
    }
  ): Object {
    const data = [...state.data];
    const newData = updateItemWithId(
      id,
      {
        workflowstatus: error ? origStatus : 'SCHEDULED',
        scheduled: error ? null : date,
      },
      data
    );

    return { ...state, ...{ data: newData } };
  },
};

const setPriority: Object = {
  next (
    state: Object,
    {
      payload: { id, priority },
    }: {
      payload: Object,
      id: number,
      priority: number,
    }
  ): Object {
    const data = updateItemWithId(id, { priority }, [...state.data]);

    return { ...state, ...{ data } };
  },
};

// Locking / unlocking
const lock: Object = {
  next (state) {
    return state;
  },
};
const lockWs: Object = {
  next (
    state: Object,
    {
      payload: { events },
    }: {
      events: Array<Object>,
    }
  ): Object {
    const data = [...state.data];
    let newData = data;

    events.forEach(({ id, username, note }: Object) => {
      const order: ?Object = data.find((ord: Object): boolean => ord.id === id);

      if (order) {
        const currentNotes = order.notes || [];
        const notes = [
          ...currentNotes,
          {
            saved: true,
            username,
            note,
          },
        ];

        newData = updateItemWithId(
          id,
          {
            operator_lock: username,
            notes,
            note_count: order.note_count + 1,
          },
          data
        );
      }
    });

    return { ...state, ...{ data: newData } };
  },
};

const updateErrors: Object = {
  next (
    state: Object,
    {
      payload: { id, errors },
    }: {
      payload: Object,
      id: number,
      errors: Array<Object>,
    }
  ): Object {
    if (errors.err) return state;

    const data = [...state.data];
    const newData = updateItemWithId(
      id,
      {
        ErrorInstances: errors,
      },
      data
    );

    return { ...state, ...{ data: newData } };
  },
};

const updateHierarchy: Object = {
  next (
    state: Object,
    {
      payload: { id, hierarchy, error },
    }: {
      payload: Object,
      id: number,
      hierarchy: Object,
      error: boolean,
    }
  ): Object {
    if (error) {
      return state;
    }

    const data = updateItemWithId(
      id,
      {
        HierarchyInfo: hierarchy,
      },
      [...state.data]
    );

    return { ...state, ...{ data } };
  },
};

const updateStepInstances: Object = {
  next (
    state: Object,
    {
      payload: { id, steps, error },
    }: {
      payload: Object,
      id: number,
      steps: Object,
      error: boolean,
    }
  ): Object {
    if (error) {
      return state;
    }

    const data = updateItemWithId(
      id,
      {
        StepInstances: steps,
      },
      [...state.data]
    );

    return { ...state, ...{ data } };
  },
};

const fetchYamlData: Object = {
  next (
    state: Object,
    {
      payload: { id, yamlData },
    }: {
      payload: Object,
      id: number,
      yamlData: string,
    }
  ): Object {
    const data = updateItemWithId(
      id,
      {
        yamlData,
      },
      [...state.data]
    );

    return { ...state, ...{ data } };
  },
};

const updateSensitiveData: Object = {
  next (
    state: Object,
    {
      payload: { newdata, id, skey, svalue },
    }
  ): Object {
    const data: Array<Object> = [...state.data];
    const order = data.find((datum: Object): boolean => datum.id === id);

    if (order) {
      const sensitiveData = order.sensitive_data;

      sensitiveData[skey][svalue].data = jsYaml.safeLoad(newdata);

      const updatedData: Object = updateItemWithId(
        id,
        { sensitive_data: sensitiveData },
        data
      );

      return { ...state, ...{ updatedData } };
    }

    return state;
  },
};

const updateData: Object = {
  next (state: Object): Object {
    return state;
  },
};

const unsync = {
  next () {
    return { ...initialState };
  },
};

export {
  addOrder as ADDORDER,
  modifyOrder as MODIFYORDER,
  addNoteWebsocket as ADDNOTEWEBSOCKET,
  addNote as ADDNOTE,
  updateDone as UPDATEDONE,
  fetchData as FETCHDATA,
  unsync as UNSYNC,
  orderAction as ORDERACTION,
  skipStep as SKIPSTEP,
  schedule as SCHEDULE,
  updateErrors as UPDATEERRORS,
  updateHierarchy as UPDATEHIERARCHY,
  fetchOrders as FETCHORDERS,
  changeOffset as CHANGEOFFSET,
  changeServerSort as CHANGESERVERSORT,
  selectOrder as SELECT,
  selectAll as SELECTALL,
  selectNone as SELECTNONE,
  selectInvert as SELECTINVERT,
  unselectAll as UNSELECTALL,
  lock as LOCK,
  lockWs as LOCKWS,
  setPriority as SETPRIORITY,
  updateStepInstances as UPDATESTEPINSTANCES,
  updateData as UPDATEDATA,
  updateSensitiveData as UPDATESENSITIVEDATA,
  fetchYamlData as FETCHYAMLACTION,
};
