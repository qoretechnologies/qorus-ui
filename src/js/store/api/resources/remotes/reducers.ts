import remove from 'lodash/remove';
import { CONN_MAP_REVERSE } from '../../../../constants/remotes';
import {
  addAppenderReducer,
  addUpdateLoggerReducer,
  deleteAppenderReducer,
  deleteLoggerReducer,
  editAppenderReducer,
  loggerReducer,
} from '../../common/reducers';
import { setUpdatedToNull, updateItemWithName } from '../../utils';

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

const toggleDebug = {
  next(state: Object = initialState): Object {
    return state;
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const resetConnection = {
  next(state: Object = initialState): Object {
    return state;
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const deleteConnection = {
  next(state: Object = initialState): Object {
    return state;
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const manageConnection = {
  next(state: Object = initialState): Object {
    return state;
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const connectionChange = {
  next(state: Object = initialState, { payload: { events } }): Object {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'sync' does not exist on type 'Object'.
    if (state.sync) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      const data = [...state.data];
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach((dt: Object) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
        const exists = state.data.find((conn) => conn.name === dt.name);

        if (exists) {
          newData = updateItemWithName(
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
            dt.name,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'up' does not exist on type 'Object'.
            { up: dt.up, enabled: dt.enabled, _updated: true },
            newData
          );
        }
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const debugChange = {
  next(state: Object = initialState, { payload: { events } }): Object {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'sync' does not exist on type 'Object'.
    if (state.sync) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      const data = [...state.data];
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach((dt: Object) => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
        const exists = state.data.find((conn) => conn.name === dt.name);

        if (exists) {
          newData = updateItemWithName(
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
            dt.name,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'debug_data' does not exist on type 'Obje... Remove this comment to see the full error message
            { debug_data: dt.debug_data, _updated: true },
            newData
          );
        }
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const enabledChange = {
  next(state: Object = initialState, { payload: { events } }): Object {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'sync' does not exist on type 'Object'.
    if (state.sync) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      const data = [...state.data];
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach((dt: Object) => {
        newData = updateItemWithName(
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
          dt.name,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'enabled' does not exist on type 'Object'... Remove this comment to see the full error message
          { enabled: dt.enabled, _updated: true },
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
  next(state, { payload: { name } }) {
    if (state.sync) {
      const data = state.data.slice();
      const connection = data.find((d) => d.name === name);

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

const fetchPass = {
  next(state, { payload: { safeUrl, name, remoteType } }) {
    if (state.sync) {
      const data = [...state.data];
      const connection = data.find(
        (d) => d.name === name && CONN_MAP_REVERSE[d.conntype] === remoteType
      );

      if (connection) {
        const newData = updateItemWithName(name, { safeUrl }, data);

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
  next(state = initialState, { payload: { events } }) {
    if (state.sync) {
      const stateData = [...state.data];
      let newData = stateData;

      events.forEach((dt) => {
        const remote = newData.find(
          (r) => r.name === dt.name && r.conntype === dt.type
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
  next(state = initialState, { payload: { events } }) {
    if (state.sync) {
      const stateData = [...state.data];
      let newData = stateData;

      events.forEach((dt) => {
        const remote = newData.find(
          (r) => r.name === dt.name && r.conntype === dt.type
        );

        if (remote) {
          const alerts = [...remote.alerts];

          remove(alerts, (alert) => alert.alertid === parseInt(dt.alertid, 10));

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

const updateConnection = {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
  next(state: Object = initialState, { payload: { models } }: Object): Object {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    let newData = [...state.data];

    models.forEach((dt) => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      const exists = state.data.find((conn) => conn.name === dt.name);
      if (exists) {
        newData = updateItemWithName(
          dt.name,
          { ...dt, _updated: true },
          newData
        );
      }
    });

    return { ...state, ...{ data: newData } };
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const addConnection = {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
  next(state: Object = initialState, { payload: { events } }: Object): Object {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    let newData = [...state.data];

    events.forEach((dt) => {
      newData = [
        ...newData,
        {
          alerts: [],
          ...dt,
        },
      ];
    });

    return { ...state, ...{ data: newData } };
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const removeConnectionWs = {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
  next(state: Object = initialState, { payload: { events } }: Object): Object {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = [...state.data];

    events.forEach((dt) => {
      remove(
        data,
        (remote: Object): boolean =>
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
          remote.name === dt.name && remote.conntype === dt.type
      );
    });

    return { ...state, ...{ data } };
  },
};

// LOGGER
const fetchLogger = loggerReducer;
const addUpdateLogger = addUpdateLoggerReducer;
const deleteLogger = deleteLoggerReducer;
const addAppender = addAppenderReducer;
const editAppender = editAppenderReducer;
const deleteAppender = deleteAppenderReducer;

export {
  pingRemote as PINGREMOTE,
  connectionChange as CONNECTIONCHANGE,
  debugChange as DEBUGCHANGE,
  enabledChange as ENABLEDCHANGE,
  updateDone as UPDATEDONE,
  addAlert as ADDALERT,
  clearAlert as CLEARALERT,
  manageConnection as MANAGECONNECTION,
  deleteConnection as DELETECONNECTION,
  removeConnectionWs as REMOVECONNECTIONWS,
  toggleConnection as TOGGLECONNECTION,
  toggleDebug as TOGGLEDEBUG,
  resetConnection as RESETCONNECTION,
  updateConnection as UPDATECONNECTION,
  addConnection as ADDCONNECTION,
  fetchPass as FETCHPASS,
  fetchLogger as FETCHLOGGER,
  addUpdateLogger as ADDUPDATELOGGER,
  deleteLogger as DELETELOGGER,
  addAppender as ADDAPPENDER,
  editAppender as EDITAPPENDER,
  deleteAppender as DELETEAPPENDER,
};
