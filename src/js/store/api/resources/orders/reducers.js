/* @flow */
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

const fetchData = {
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
};
