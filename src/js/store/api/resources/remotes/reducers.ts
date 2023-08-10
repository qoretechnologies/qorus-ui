import omit from 'lodash/omit';
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
  next(state: any = initialState): any {
    return state;
  },
  throw(state: any = initialState): any {
    return state;
  },
};

const toggleConnection = {
  next(state: any = initialState): any {
    return state;
  },
  throw(state: any = initialState): any {
    return state;
  },
};

const toggleDebug = {
  next(state: any = initialState): any {
    return state;
  },
  throw(state: any = initialState): any {
    return state;
  },
};

const resetConnection = {
  next(state: any = initialState): any {
    return state;
  },
  throw(state: any = initialState): any {
    return state;
  },
};

const deleteConnection = {
  next(state: any = initialState): any {
    return state;
  },
  throw(state: any = initialState): any {
    return state;
  },
};

const manageConnection = {
  next(state: any = initialState): any {
    return state;
  },
  throw(state: any = initialState): any {
    return state;
  },
};

const connectionChange = {
  next(state: any = initialState, { payload: { events } }): any {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'sync' does not exist on type 'Object'.
    if (state.sync) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      const data = [...state.data];
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach((dt: any) => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
        const exists = state.data.find((conn) => conn.name === dt.name);

        if (exists) {
          newData = updateItemWithName(
            // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
            dt.name,
            // @ts-ignore ts-migrate(2339) FIXME: Property 'up' does not exist on type 'Object'.
            { up: dt.up, enabled: dt.enabled, _updated: true },
            newData
          );
        }
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw(state: any = initialState): any {
    return state;
  },
};

const debugChange = {
  next(state: any = initialState, { payload: { events } }): any {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'sync' does not exist on type 'Object'.
    if (state.sync) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      const data = [...state.data];
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach((dt: any) => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
        const exists = state.data.find((conn) => conn.name === dt.name);

        if (exists) {
          newData = updateItemWithName(
            // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
            dt.name,
            // @ts-ignore ts-migrate(2339) FIXME: Property 'debug_data' does not exist on type 'Obje... Remove this comment to see the full error message
            { debug_data: dt.debug_data, _updated: true },
            newData
          );
        }
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw(state: any = initialState): any {
    return state;
  },
};

const enabledChange = {
  next(state: any = initialState, { payload: { events } }): any {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'sync' does not exist on type 'Object'.
    if (state.sync) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      const data = [...state.data];
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach((dt: any) => {
        newData = updateItemWithName(
          // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
          dt.name,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'enabled' does not exist on type 'Object'... Remove this comment to see the full error message
          { enabled: dt.enabled, _updated: true },
          newData
        );
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw(state: any = initialState): any {
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
        const remote = newData.find((r) => r.name === dt.name && r.conntype === dt.type);

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
        const remote = newData.find((r) => r.name === dt.name && r.conntype === dt.type);

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
  // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
  next(state: any = initialState, { payload: { models } }: any): any {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    let newData = [...state.data];

    models.forEach((dt) => {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      const exists = state.data.find((conn) => conn.name === dt.name);
      if (exists) {
        newData = updateItemWithName(dt.name, { ...omit(dt, ['id']), _updated: true }, newData);
      }
    });

    return { ...state, ...{ data: newData } };
  },
  throw(state: any = initialState): any {
    return state;
  },
};

const addConnection = {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
  next(state: any = initialState, { payload: { events } }: any): any {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
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
  throw(state: any = initialState): any {
    return state;
  },
};

const removeConnectionWs = {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
  next(state: any = initialState, { payload: { events } }: any): any {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = [...state.data];

    events.forEach((dt) => {
      remove(
        data,
        (remote: any): boolean =>
          // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
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
  addAlert as ADDALERT,
  addAppender as ADDAPPENDER,
  addConnection as ADDCONNECTION,
  addUpdateLogger as ADDUPDATELOGGER,
  clearAlert as CLEARALERT,
  connectionChange as CONNECTIONCHANGE,
  debugChange as DEBUGCHANGE,
  deleteAppender as DELETEAPPENDER,
  deleteConnection as DELETECONNECTION,
  deleteLogger as DELETELOGGER,
  editAppender as EDITAPPENDER,
  enabledChange as ENABLEDCHANGE,
  fetchLogger as FETCHLOGGER,
  fetchPass as FETCHPASS,
  manageConnection as MANAGECONNECTION,
  pingRemote as PINGREMOTE,
  removeConnectionWs as REMOVECONNECTIONWS,
  resetConnection as RESETCONNECTION,
  toggleConnection as TOGGLECONNECTION,
  toggleDebug as TOGGLEDEBUG,
  updateConnection as UPDATECONNECTION,
  updateDone as UPDATEDONE,
};
