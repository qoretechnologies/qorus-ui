/* @flow */
import isArray from 'lodash/isArray';

import { updateItemWithId, setUpdatedToNull } from '../../utils';
import { normalizeName } from '../utils';

const initialState: Object = { data: [], sync: false, loading: false };

const addOrder: Object = {
  next(
    state: Object = initialState,
    { payload: { order, time } }: { payload: Object, order: Object, time: string }
  ): Object {
    if (state.sync) {
      const data = [...state.data];
      const updatedData = setUpdatedToNull(data);
      const normalized = normalizeName({ ...order, ...{ id: order.workflow_instanceid } });
      const newData = [...updatedData, {
        ...normalized,
        ...{
          _updated: true,
          started: time,
          workflowstatus: order.status,
          note_count: 0,
        },
      }];

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
      payload: { id, status, modified },
    }: {
      payload: Object,
      id: number,
      status: string,
      modified: string
    }
  ): Object {
    if (state.sync) {
      const data = [...state.data];
      const updatedData = setUpdatedToNull(data);
      const newData = updateItemWithId(id, {
        workflowstatus: status,
        modified,
        _updated: true,
      }, updatedData);

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
    { payload: { id, note } }: { payload: Object, id: number, note: Object }
  ): Object {
    if (state.data.length) {
      const data = state.data.slice();
      const order = data.find(d => d.id === id);
      const notes = [...order.notes, note];
      const noteCount = order.note_count + 1;
      const newData = updateItemWithId(id, { notes, note_count: noteCount }, data);

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
};
