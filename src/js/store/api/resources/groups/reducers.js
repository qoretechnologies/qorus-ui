/* @flow */
import { updateItemWithName, setUpdatedToNull } from '../../utils';

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

export {
  setEnabled as SETENABLED,
  updateDone as UPDATEDONE,
};
