/* @flow */
import isArray from 'lodash/isArray';

import { updateItemWithId, setUpdatedToNull } from '../../utils';
import { normalizeName } from '../utils';
import { skipIndexes } from './actions/helpers';

const initialState: Object = { data: [], sync: false, loading: false };

const addOrder: Object = {
  next(
    state: Object = initialState,
    { payload: { events } }: { payload: Object, events: Array<Object> }
  ): Object {
    if (state.sync) {
      const data = [...state.data];
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach((obj: Object): void => {
        const normalized = normalizeName({ ...obj.info, ...{ id: obj.info.workflow_instanceid } });

        newData = [...newData, {
          ...normalized,
          ...{
            _updated: true,
            started: obj.time,
            workflowstatus: obj.info.status,
            note_count: 0,
          },
        }];
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw(state: Object = initialState, action: Object): Object {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      error: action.payload,
    });
  },
};

const modifyOrder: Object = {
  next(
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

      events.forEach((dt: Object): void => {
        newData = updateItemWithId(dt.id, {
          workflowstatus: dt.new,
          modified: dt.time,
          _updated: true,
        }, newData);
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw(state: Object = initialState, action: Object): Object {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      error: action.payload,
    });
  },
};

const addNoteWebsocket = {
  next(
    state: Object = initialState,
    { payload: { events } }: { payload: Object, events: Array<Object> }
  ): Object {
    if (state.data.length) {
      const data = state.data.slice();
      let newData = data;

      events.forEach((dt: Object): void => {
        const order = newData.find(d => d.id === dt.id);
        const notes = [...order.notes, dt.note];
        const noteCount = order.note_count + 1;
        newData = updateItemWithId(dt.id, { notes, note_count: noteCount }, newData);
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw(state: Object = initialState, action: Object): Object {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      error: action.payload,
    });
  },
};

const updateDone = {
  next(state: Object, { payload: { id } }: { payload: Object, id: number }) {
    if (state.sync) {
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
      error: action.payload,
    });
  },
};

const fetchData: Object = {
  next(
    state: Object,
    { payload: { id, type, data } }: {
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
  throw(state: Object, action: Object) {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      error: action.payload,
    });
  },
};

const orderAction: Object = {
  next(state: Object, { payload: { ids, action, origStatus, result } }: Object) {
    const data = [...state.data];
    let newData = data;

    if (result) {
      Object.keys(result).forEach((res: string): void => {
        if (typeof result[res] === 'string') {
          newData = updateItemWithId(
            parseInt(res, 10),
            { workflowstatus: origStatus[parseInt(res, 10)] },
            newData
          );
        }
      });
    } else {
      if (isArray(ids)) {
        ids.forEach((id: number): void => {
          newData = updateItemWithId(id, { workflowstatus: `${action.toUpperCase()}ING` }, newData);
        });
      } else {
        newData = updateItemWithId(ids, { workflowstatus: `${action.toUpperCase()}ING` }, newData);
      }
    }

    return { ...state, ...{ data: newData } };
  },
};

const skipStep: Object = {
  next(
    state: Object,
    { payload: { orderId, stepid, ind } }: {
      payload: Object,
      orderId: number,
      stepid: number,
      ind: string,
    }
  ): Object {
    const data = [...state.data];
    const order: ?Object = data.find((ord: Object): boolean => ord.id === orderId);
    const newInstances = skipIndexes(order, stepid, ind);
    const newData = updateItemWithId(orderId, { StepInstances: newInstances }, data);

    return { ...state, ...{ data: newData } };
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
  updateDone as UPDATEDONE,
  fetchData as FETCHDATA,
  unsync as UNSYNC,
  orderAction as ORDERACTION,
  skipStep as SKIPSTEP,
};
