/* @flow */
import isArray from 'lodash/isArray';
import { setUpdatedToNull, updateItemWithId } from '../../utils';
import { normalizeName } from '../utils';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/store/api/res... Remove this comment to see the full error message
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
    const normalizedIds = newData.map(
      (order: Object): Object => ({
        ...order,
        ...{
          // @ts-ignore ts-migrate(2339) FIXME: Property 'workflow_instanceid' does not exist on t... Remove this comment to see the full error message
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

const changeServerSort: Object = {
  next(
    state: Object = initialState,
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      payload: { sort },
    }: Object
  ): Object {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'sort' does not exist on type 'Object'.
    const sortDir = state.sort === sort ? !state.sortDir : state.sortDir;

    return { ...state, ...{ offset: 0, sort, sortDir } };
  },
};

const selectOrder: Object = {
  next(state = initialState, { payload: { id } }) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const stateData = [...state.data];
    // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
    const order = stateData.find((ord: Object) => ord.id === parseInt(id, 10));

    if (order) {
      const newData = updateItemWithId(id, { _selected: !order._selected }, stateData);

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

const selectAll = {
  next(state: Object = initialState) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = [...state.data];
    const newData = data.map((w) => ({ ...w, ...{ _selected: true } }));

    return { ...state, ...{ data: newData } };
  },
};

const selectNone = {
  next(state: Object = initialState) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = [...state.data];
    const newData = data.map((w) => {
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
  next(state: Object = initialState) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = [...state.data];
    const newData = data.map((w) => ({ ...w, ...{ _selected: !w._selected } }));

    return { ...state, ...{ data: newData } };
  },
};

const unselectAll = {
  next(state: Object) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = [...state.data];
    const newData = data.map((w) =>
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
  next(
    state: Object = initialState,
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'events' does not exist on type 'Object'.
      payload: { events },
    }: { payload: Object; events: Array<Object> }
  ): Object {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'sync' does not exist on type 'Object'.
    if (state.sync) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      const data = [...state.data];
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach((obj: Object): void => {
        const normalized = normalizeName({
          // @ts-ignore ts-migrate(2339) FIXME: Property 'info' does not exist on type 'Object'.
          ...obj.info,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'info' does not exist on type 'Object'.
          ...{ id: obj.info.workflow_instanceid },
        });

        newData = [
          {
            ...normalized,
            ...{
              _updated: true,
              // @ts-ignore ts-migrate(2339) FIXME: Property 'time' does not exist on type 'Object'.
              started: obj.time,
              // @ts-ignore ts-migrate(2339) FIXME: Property 'info' does not exist on type 'Object'.
              workflowstatus: obj.info.status,
              note_count: 0,
            },
          },
          ...newData,
        ];
      });

      const reducedData: Array<Object> = newData.slice(
        0,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'offset' does not exist on type 'Object'.
        state.offset + state.limit
      );

      return { ...state, ...{ data: reducedData } };
    }

    return state;
  },
  throw(state: Object = initialState, action: Object): Object {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      error: action.payload,
    });
  },
};

const modifyOrder: Object = {
  next(
    state: Object = initialState,
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'events' does not exist on type 'Object'.
      payload: { events },
    }: {
      payload: Object;
      events: Array<Object>;
    }
  ): Object {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'sync' does not exist on type 'Object'.
    if (state.sync) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      const data = [...state.data];
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach((dt: Object): void => {
        newData = updateItemWithId(
          // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
          dt.id,
          {
            // @ts-ignore ts-migrate(2339) FIXME: Property 'new' does not exist on type 'Object'.
            workflowstatus: dt.new,
            // @ts-ignore ts-migrate(2339) FIXME: Property 'time' does not exist on type 'Object'.
            modified: dt.time,
            _updated: true,
          },
          newData
        );
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw(state: Object = initialState, action: Object): Object {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      error: action.payload,
    });
  },
};

const addNote = {
  next(state) {
    return state;
  },
};

const addNoteWebsocket = {
  next(
    state: Object = initialState,
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'events' does not exist on type 'Object'.
      payload: { events },
    }: { payload: Object; events: Array<Object> }
  ): Object {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    if (state.data.length) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      const data = state.data.slice();
      let newData = data;

      events.forEach((dt: Object): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
        const order = newData.find((d) => d.id === dt.id);
        // @ts-ignore ts-migrate(2339) FIXME: Property 'note' does not exist on type 'Object'.
        const notes = [...order.notes, dt.note];
        const noteCount = order.note_count + 1;
        newData = updateItemWithId(
          // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
          dt.id,
          { notes, note_count: noteCount },
          newData
        );
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw(state: Object = initialState, action: Object): Object {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      error: action.payload,
    });
  },
};

const updateDone = {
  next(
    state: Object,
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
      payload: { id },
    }: { payload: Object; id: number }
  ) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'sync' does not exist on type 'Object'.
    if (state.sync) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      const data: Array<Object> = state.data.slice();
      const newData: Array<Object> = updateItemWithId(id, { _updated: null }, data);

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw(state: Object, action: Object) {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      error: action.payload,
    });
  },
};

const fetchData: Object = {
  next(
    state: Object,
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
      payload: { id, type, data },
    }: {
      payload: Object;
      id: number;
      type: string;
      data: Object;
    }
  ): Object {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const dt = [...state.data];
    const newData = updateItemWithId(id, { [type]: data }, dt);

    return { ...state, ...{ data: newData } };
  },
  throw(state: Object, action: Object) {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      error: action.payload,
    });
  },
};

const orderAction: Object = {
  next(
    state: Object,
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      payload: { ids, action, result },
    }: Object
  ) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = [...state.data];
    let newData = data;

    if (result) {
      Object.keys(result).forEach((res: string): void => {
        if (typeof result[res] === 'string') {
          const ord = newData.find(
            // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
            (order: Object): boolean => order.id === parseInt(res, 10)
          );

          newData = updateItemWithId(
            parseInt(res, 10),
            { workflowstatus: ord ? ord._originalStatus : null },
            newData
          );
        }
      });
    } else {
      const orders: Array<number> = isArray(ids) ? ids : [ids];

      orders.forEach((id: number): void => {
        const ord = newData.find(
          // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
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
      });
    }

    return { ...state, ...{ data: newData } };
  },
};

const skipStep: Object = {
  next(
    state: Object,
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'orderId' does not exist on type 'Object'... Remove this comment to see the full error message
      payload: { orderId, stepid, ind },
    }: {
      payload: Object;
      orderId: number;
      stepid: number;
      ind: string;
    }
  ): Object {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = [...state.data];
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    const order: Object = data.find(
      // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
      (ord: Object): boolean => ord.id === orderId
    );
    const newInstances = skipIndexes(order, stepid, ind);
    const newData = updateItemWithId(orderId, { StepInstances: newInstances }, data);

    return { ...state, ...{ data: newData } };
  },
};

const schedule: Object = {
  next(
    state: Object,
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
      payload: { id, date, error, origStatus },
    }: {
      payload: Object;
      id: number;
      date: string;
      error: boolean;
      origStatus: string;
    }
  ): Object {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
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
  next(
    state: Object,
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
      payload: { id, priority },
    }: {
      payload: Object;
      id: number;
      priority: number;
    }
  ): Object {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = updateItemWithId(id, { priority }, [...state.data]);

    return { ...state, ...{ data } };
  },
};

// Locking / unlocking
const lock: Object = {
  next(state) {
    return state;
  },
};
const lockWs: Object = {
  next(
    state: Object,
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type '{ event... Remove this comment to see the full error message
      payload: { events },
    }: {
      events: Array<Object>;
    }
  ): Object {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = [...state.data];
    let newData = data;

    // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
    events.forEach(({ id, username, note }: Object) => {
      // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
      const order: Object = data.find((ord: Object): boolean => ord.id === id);

      if (order) {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'notes' does not exist on type 'Object'.
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
            // @ts-ignore ts-migrate(2339) FIXME: Property 'note_count' does not exist on type 'Obje... Remove this comment to see the full error message
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
  next(
    state: Object,
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
      payload: { id, errors },
    }: {
      payload: Object;
      id: number;
      errors: Array<Object>;
    }
  ): Object {
    if (errors.err) return state;

    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
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
  next(
    state: Object,
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
      payload: { id, hierarchy, error },
    }: {
      payload: Object;
      id: number;
      hierarchy: Object;
      error: boolean;
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
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      [...state.data]
    );

    return { ...state, ...{ data } };
  },
};

const updateStepInstances: Object = {
  next(
    state: Object,
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
      payload: { id, steps, error },
    }: {
      payload: Object;
      id: number;
      steps: Object;
      error: boolean;
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
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      [...state.data]
    );

    return { ...state, ...{ data } };
  },
};

const fetchYamlData: Object = {
  next(
    state: Object,
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
      payload: { id, yamlData },
    }: {
      payload: Object;
      id: number;
      yamlData: string;
    }
  ): Object {
    const data = updateItemWithId(
      id,
      {
        yamlData,
      },
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      [...state.data]
    );

    return { ...state, ...{ data } };
  },
};

const fetchStepData: Object = {
  next(
    state: Object,
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
      payload: { id, stepData },
    }: {
      payload: Object;
      id: number;
      stepData: string;
    }
  ): Object {
    if (!stepData) {
      return state;
    }

    const data = updateItemWithId(
      id,
      {
        stepdata: stepData,
      },
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      [...state.data]
    );

    return { ...state, ...{ data } };
  },
};

const updateSensitiveData: Object = {
  next(state: Object): Object {
    return state;
  },
};

const updateData: Object = {
  next(state: Object): Object {
    return state;
  },
};

const unsync = {
  next() {
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
  fetchStepData as FETCHSTEPDATA,
};
