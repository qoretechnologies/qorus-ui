import { updateItemWithName, setUpdatedToNull } from '../../utils';
import remove from 'lodash/remove';

import { CONN_MAP, CONN_MAP_REVERSE } from '../../../../constants/remotes';
import { buildRemoteHash } from '../../../../helpers/remotes';

const initialState = {
  data: [],
  loading: false,
  sync: false,
};

const pingRemote = {
  next (state: Object = initialState): Object {
    return state;
  },
  throw (state: Object = initialState): Object {
    return state;
  },
};

const toggleConnection = {
  next (state: Object = initialState): Object {
    return state;
  },
  throw (state: Object = initialState): Object {
    return state;
  },
};

const resetConnection = {
  next (state: Object = initialState): Object {
    return state;
  },
  throw (state: Object = initialState): Object {
    return state;
  },
};

const deleteConnection = {
  next (state: Object = initialState): Object {
    return state;
  },
  throw (state: Object = initialState): Object {
    return state;
  },
};

const manageConnection = {
  next (state: Object = initialState): Object {
    return state;
  },
  throw (state: Object = initialState): Object {
    return state;
  },
};

const connectionChange = {
  next (
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
          { up: dt.up, enabled: dt.enabled, _updated: true },
          newData
        );
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw (state: Object = initialState): Object {
    return state;
  },
};

const enabledChange = {
  next (
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
          { enabled: dt.enabled, _updated: true },
          newData
        );
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw (state: Object = initialState): Object {
    return state;
  },
};

const updateDone = {
  next (
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
  throw (state) {
    return state;
  },
};

const fetchPass = {
  next (
    state,
    {
      payload: { safeUrl, name, remoteType },
    }
  ) {
    if (state.sync) {
      const data = [...state.data];
      const connection = data.find(
        d => d.name === name && CONN_MAP_REVERSE[d.conntype] === remoteType
      );

      if (connection) {
        const newData = updateItemWithName(name, { safeUrl }, data);

        return { ...state, ...{ data: newData } };
      }
    }

    return state;
  },
  throw (state) {
    return state;
  },
};

const addAlert = {
  next (
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
          r => r.name === dt.name && r.conntype === dt.type
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
  throw (state = initialState, action) {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      error: action.payload,
    });
  },
};

const clearAlert = {
  next (
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
          r => r.name === dt.name && r.conntype === dt.type
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
  throw (state = initialState, action) {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      error: action.payload,
    });
  },
};

const updateConnection = {
  next (
    state: Object = initialState,
    {
      payload: { models },
    }: Object
  ): Object {
    let newData = [...state.data];

    models.forEach(dt => {
      newData = updateItemWithName(dt.name, { ...dt, _updated: true }, newData);
    });

    return { ...state, ...{ data: newData } };
  },
  throw (state: Object = initialState): Object {
    return state;
  },
};

const addConnection = {
  next (
    state: Object = initialState,
    {
      payload: { events },
    }: Object
  ): Object {
    let newData = [...state.data];

    events.forEach(dt => {
      newData = [...newData, dt];
    });

    return { ...state, ...{ data: newData } };
  },
  throw (state: Object = initialState): Object {
    return state;
  },
};

const removeConnectionWs = {
  next (
    state: Object = initialState,
    {
      payload: { events },
    }: Object
  ): Object {
    const data = [...state.data];

    events.forEach(dt => {
      remove(
        data,
        (remote: Object): boolean =>
          remote.name === dt.name && remote.conntype === dt.type
      );
    });

    return { ...state, ...{ data } };
  },
};

export {
  pingRemote as PINGREMOTE,
  connectionChange as CONNECTIONCHANGE,
  enabledChange as ENABLEDCHANGE,
  updateDone as UPDATEDONE,
  addAlert as ADDALERT,
  clearAlert as CLEARALERT,
  manageConnection as MANAGECONNECTION,
  deleteConnection as DELETECONNECTION,
  removeConnectionWs as REMOVECONNECTIONWS,
  toggleConnection as TOGGLECONNECTION,
  resetConnection as RESETCONNECTION,
  updateConnection as UPDATECONNECTION,
  addConnection as ADDCONNECTION,
  fetchPass as FETCHPASS,
};
