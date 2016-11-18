import { updateItemWithName, setUpdatedToNull } from '../../utils';
import remove from 'lodash/remove';

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

const addAlert = {
  next(state = initialState, { payload: { data } }) {
    if (state.sync) {
      const stateData = [...state.data];
      const remote = stateData.find((r) => r.id === data.id && r.conntype === data.type);
      const alerts = [...remote.alerts, data];
      const newData = updateItemWithName(data.id, {
        alerts,
        has_alerts: true,
        _updated: true,
      }, stateData);

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw(state = initialState, action) {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      error: action.payload,
    });
  },
};

const clearAlert = {
  next(state = initialState, { payload: { id, type, alertid } }) {
    if (state.sync) {
      const stateData = [...state.data];
      console.log(id, type);
      const remote = stateData.find((r) => r.id === id && r.conntype === type);
      const alerts = [...remote.alerts];

      remove(alerts, alert => alert.alertid === parseInt(alertid, 10));

      const newData = updateItemWithName(id, {
        alerts,
        has_alerts: !(alerts.length === 0),
        _updated: true,
      }, stateData);

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw(state = initialState, action) {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      error: action.payload,
    });
  },
};

export {
  pingRemote as PINGREMOTE,
  connectionChange as CONNECTIONCHANGE,
  updateDone as UPDATEDONE,
  addAlert as ADDALERT,
  clearAlert as CLEARALERT,
};
