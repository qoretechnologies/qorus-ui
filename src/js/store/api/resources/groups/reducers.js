/* @flow */
import { updateItemWithName, setUpdatedToNull } from '../../utils';
import {
  select,
  selectAll,
  selectNone,
  selectInvert,
} from '../../../../helpers/resources';


const initialState: Object = { data: [], sync: false, loading: false };

const setEnabled: Object = {
  next(state: Object = initialState, { payload: { events } }): Object {
    if (state.sync) {
      const data = state.data.slice();
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach((dt: Object): void => {
        newData = updateItemWithName(dt.name, { enabled: dt.enabled, _updated: true }, newData);
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

const updateDone = {
  next(state: Object, { payload: { name } }: { payload: Object, name: string }) {
    if (state.sync) {
      const data = state.data.slice();
      const newData = updateItemWithName(name, { _updated: null }, data);

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

const groupAction = {
  next(state: Object = initialState) {
    return state;
  },
};

const selectGroup = {
  next(state: Object = initialState, { payload: { id } }: { payload: Object, id: string}) {
    return select(state, id);
  },
};

const selectAllGroups = {
  next(state: Object = initialState) {
    return selectAll(state);
  },
};

const selectNoneGroups = {
  next(state: Object = initialState) {
    return selectNone(state);
  },
};

const invertSelection = {
  next(state: Object = initialState) {
    return selectInvert(state);
  },
};

export {
  setEnabled as SETENABLED,
  updateDone as UPDATEDONE,
  selectGroup as SELECT,
  selectAllGroups as SELECTALL,
  selectNoneGroups as SELECTNONE,
  invertSelection as SELECTINVERT,
  groupAction as GROUPACTION,
};
