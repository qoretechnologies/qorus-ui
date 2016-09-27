import { updateItemWithName, setUpdatedToNull } from '../../utils';

const initialState = {
  data: [],
  loading: false,
  sync: false,
};

const pingRemote = {
  next(state: Object = initialState): Object {
    return state;
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const connectionChange = {
  next(state: Object = initialState, { payload: { name, up } }): Object {
    if (state.sync) {
      const data = [...state.data];
      const updatedData = setUpdatedToNull(data);
      const newData = updateItemWithName(name, { up, _updated: true }, updatedData);

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const updateDone = {
  next(state, { payload: { name } }) {
    if (state.sync) {
      const data = state.data.slice();
      const connection = data.find(d => d.name === name);

      if (connection) {
        const newData = updateItemWithName(name, { _updated: null }, data);

        return { ...state, ...{ data: newData } };
      }
    }

    return state;
  },
  throw(state) {
    return state;
  },
};

export {
  pingRemote as PINGREMOTE,
  connectionChange as CONNECTIONCHANGE,
  updateDone as UPDATEDONE,
};
