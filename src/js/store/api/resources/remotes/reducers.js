import { updateItemWithName, setUpdatedToNull } from '../../utils';
import remove from 'lodash/remove';

import { CONN_MAP } from '../../../../constants/remotes';
import { buildRemoteHash } from '../../../../helpers/remotes';

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

const toggleConnection = {
  next(state: Object = initialState): Object {
    return state;
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const connectionChange = {
  next(
    state: Object = initialState,
    {
      payload: { events },
    }
  ): Object {
    if (state.sync) {
      const data = [...state.data];
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach((dt: Object) => {
        newData = updateItemWithName(
          dt.name,
          { up: dt.up, _updated: true },
          newData
        );
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const updateDone = {
  next(
    state,
    {
      payload: { name },
    }
  ) {
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
  next(
    state = initialState,
    {
      payload: { events },
    }
  ) {
    if (state.sync) {
      const stateData = [...state.data];
      let newData = stateData;

      events.forEach(dt => {
        const remote = newData.find(
          r => r.id === dt.id && r.conntype === dt.type
        );

        if (remote) {
          const alerts = [...remote.alerts, dt];
          newData = updateItemWithName(
            dt.id,
            {
              alerts,
              has_alerts: true,
              _updated: true,
            },
            newData
          );
        }
      });

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
  next(
    state = initialState,
    {
      payload: { events },
    }
  ) {
    if (state.sync) {
      const stateData = [...state.data];
      let newData = stateData;

      events.forEach(dt => {
        const remote = newData.find(
          r => r.id === dt.id && r.conntype === dt.type
        );

        if (remote) {
          const alerts = [...remote.alerts];

          remove(alerts, alert => alert.alertid === parseInt(dt.alertid, 10));

          newData = updateItemWithName(
            dt.id,
            {
              alerts,
              has_alerts: !(alerts.length === 0),
              _updated: true,
            },
            newData
          );
        }
      });

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

const manageConnection = {
  next(
    state: Object = initialState,
    {
      payload: { remoteType, data, name, error },
    }: Object
  ): Object {
    let newData = [...state.data];

    if (error && !name) {
      remove(newData, (conn: Object) => conn.name === data.name);
    } else if (name) {
      const hashData = buildRemoteHash(remoteType, data, name);

      newData = updateItemWithName(name, hashData, newData);
    } else {
      const findRemote = newData.find(
        (remote: Object): boolean =>
          remote.name === data.name && remote.conntype === CONN_MAP[remoteType]
      );

      if (!findRemote) {
        const hashData = buildRemoteHash(remoteType, data);

        newData = [...newData, hashData];
      }
    }

    return { ...state, ...{ data: newData } };
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const deleteConnection = {
  next(
    state: Object = initialState,
    {
      payload: { remoteType, name, error },
    }: Object
  ): Object {
    const data = [...state.data];

    if (!error) {
      remove(
        data,
        (remote: Object): boolean =>
          remote.name === name && remote.conntype === CONN_MAP[remoteType]
      );
    }

    return { ...state, ...{ data } };
  },
};

export {
  pingRemote as PINGREMOTE,
  connectionChange as CONNECTIONCHANGE,
  updateDone as UPDATEDONE,
  addAlert as ADDALERT,
  clearAlert as CLEARALERT,
  manageConnection as MANAGECONNECTION,
  deleteConnection as DELETECONNECTION,
  toggleConnection as TOGGLECONNECTION,
};
