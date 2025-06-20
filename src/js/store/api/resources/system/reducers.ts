import cloneDeep from 'lodash/cloneDeep';
import { formatAppender } from '../../../../helpers/logger';
import {
  addAppenderReducer,
  addUpdateLoggerReducer,
  deleteAppenderReducer,
  deleteLoggerReducer,
  editAppenderReducer,
  loggerReducer,
  updateConfigItemWsCommon,
} from '../../common/reducers';

const addProcess = {
  next(state: any, { payload: { events } }) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = { ...state.data };
    const processes = { ...data.processes };
    const newProcesses = events.reduce(
      (cur, event) => (event.status === 0 ? cur : { ...processes, ...{ [event.id]: event } }),
      processes
    );

    const newData = { ...data, ...{ processes: newProcesses } };

    return { ...state, ...{ data: newData } };
  },
};

const removeProcess = {
  next(state: any, { payload: { events } }) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = { ...state.data };
    const processes = { ...data.processes };

    events.forEach((event) => {
      delete processes[event.id];
    });

    const newData = { ...data, ...{ processes } };

    return { ...state, ...{ data: newData } };
  },
};

const processMemoryChanged = {
  next(state: any, { payload: { events } }) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = { ...state.data };
    const processes = { ...data.processes };

    if (data.cluster_info) {
      events.forEach((event) => {
        data.cluster_info[event.node].node_priv = event.node_priv;
        data.cluster_info[event.node].node_load_pct = event.node_load_pct;
        data.cluster_info[event.node].node_ram_in_use = event.node_ram_in_use;
        data.cluster_info[event.node].node_priv_str = event.node_priv_str;
        data.cluster_info[event.node].node_ram_in_use_str = event.node_ram_in_use_str;

        if (event.status_string === 'IDLE') {
          delete processes[event.id];
        } else {
          processes[event.id] = { ...event, ...{ _updated: true } };
        }
      });

      const newData = { ...data, ...{ processes } };

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

const incrementItems = {
  next(state: any, { payload: { events } }) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = { ...state.data };

    events.forEach((event) => {
      if (event.alert) {
        data['alert-summary'][event.alertType] = data['alert-summary'][event.alertType] + 1;
      }

      if (event.type) {
        data[event.type] = data[event.type] + 1;
      }
    });

    return { ...state, ...{ data } };
  },
};

const updateLicense = {
  next(state: any, { payload: { events } }) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = { ...state.data };

    events.forEach((event) => {
      data.licensed = event.licensed;
      data.license_message = event.license_message;
    });

    return { ...state, ...{ data } };
  },
};

const decrementItems = {
  next(state: any, { payload: { events } }) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = { ...state.data };

    events.forEach((event) => {
      if (event.alert) {
        data['alert-summary'][event.alertType] =
          data['alert-summary'][event.alertType] - 1 < 0
            ? 0
            : data['alert-summary'][event.alertType] - 1;
      }

      if (event.type) {
        data[event.type] = data[event.type] - 1 < 0 ? 0 : data[event.type] - 1;
      }
    });

    return { ...state, ...{ data } };
  },
};

const updateDone = {
  next(state: any, { payload: { id } }) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = { ...state.data };
    const processes = { ...data.processes };

    processes[id]._updated = null;

    const newData = { ...data, ...{ processes } };

    return { ...state, ...{ data: newData } };
  },
};

const init = {
  next(state: any) {
    const newState = { ...state };

    // @ts-ignore ts-migrate(2339) FIXME: Property 'isOnDashboard' does not exist on type '{... Remove this comment to see the full error message
    newState.isOnDashboard = true;

    return { ...newState };
  },
};

const unsync = {
  next(state: any) {
    const newState = { ...state };

    // @ts-ignore ts-migrate(2339) FIXME: Property 'isOnDashboard' does not exist on type '{... Remove this comment to see the full error message
    newState.isOnDashboard = false;

    return { ...newState };
  },
};

const killProcess = {
  next(state: any) {
    return state;
  },
};

const updateStats = {
  next(state: any, { payload: { events } }) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = { ...state.data };

    events.forEach((event) => {
      data.order_stats = event.bands;
    });

    return { ...state, ...{ data } };
  },
};

const healthChanged = {
  next(state: any, { payload: { events } }) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = { ...state.data };

    events.forEach((event) => {
      data.health.health = event.health;
      data.health.ongoing = event.ongoing;
      data.health.transient = event.transient;
    });

    return { ...state, ...{ data } };
  },
};

const remoteHealthChanged = {
  next(state: any, { payload: { events } }) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = { ...state.data };

    events.forEach((event) => {
      const remote = data.health.remote(
        // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        (rm: any): boolean => rm.name === event.name
      );

      if (remote) {
        remote.health = event.health;
      }
    });

    return { ...state, ...{ data } };
  },
};

const removeNode = {
  next(state: any, { payload: { events } }) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = cloneDeep(state.data);

    events.forEach((event) => {
      delete data.cluster_info[event.name];
    });

    return { ...state, ...{ data } };
  },
};

const updateNodeInfo = {
  next(state: any, { payload: { events } }) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = cloneDeep(state.data);

    events.forEach((event) => {
      if (!data.cluster_info[event.name]) {
        data.cluster_info[event.name] = {
          ...event,
          mem_history: [],
          process_history: [],
        };
      } else {
        data.cluster_info[event.name].mem_history.push({
          node_priv: event.node_priv,
          node_ram_in_use: event.node_ram_in_use,
          node_ram_in_use_str: event.node_ram_in_use_str,
          node_load_pct: event.node_load_pct,
          node_cpu_count: event.node_cpu_count,
          node_priv_str: event.node_priv_str,
          timestamp: event.timestamp,
        });

        if (data.cluster_info[event.name].mem_history.length > 60) {
          data.cluster_info[event.name].mem_history.shift();
        }

        data.cluster_info[event.name].process_history.push({
          count: event.processes,
          timestamp: event.timestamp,
        });

        data.cluster_info[event.name].process_count = event.processes;
        data.cluster_info[event.name].node_load_pct = event.node_load_pct;
        data.cluster_info[event.name].node_priv = event.node_priv;
        data.cluster_info[event.name].node_priv_str = event.node_priv_str;
        data.cluster_info[event.name].node_ram_in_use = event.node_ram_in_use;
        data.cluster_info[event.name].node_ram_in_use_str = event.node_ram_in_use_str;

        if (data.cluster_info[event.name].process_history.length > 60) {
          data.cluster_info[event.name].process_history.shift();
        }
      }
    });

    return { ...state, ...{ data } };
  },
};

// Global Config
const fetchGlobalConfig = {
  next(state: any, { payload: { globalConfig } }) {
    const newState = { ...state };

    // @ts-ignore ts-migrate(2339) FIXME: Property 'globalConfig' does not exist on type '{ ... Remove this comment to see the full error message
    newState.globalConfig = globalConfig;

    return { ...newState };
  },
};

const updateConfigItemWs = updateConfigItemWsCommon;

// LOGGER
const fetchLogger = loggerReducer;
const fetchDefaultLogger = {
  next(state, { payload: { logger, appenders, intfc, empty } }) {
    let data = { ...state.data };
    let editedData;

    if (empty) {
      editedData = {
        defaultLoggers: {
          ...state.data.defaultLoggers,
          [intfc]: {
            loggerData: {
              logger: 'empty',
            },
          },
        },
      };
    } else {
      const flattenedAppenders = appenders.reduce(
        (cur: Array<Object>, appender: any) => [...cur, formatAppender(appender)],
        []
      );

      editedData = {
        defaultLoggers: {
          ...state.data.defaultLoggers,
          [intfc]: {
            loggerData: {
              logger: logger.params,
              appenders: flattenedAppenders,
            },
          },
        },
      };
    }

    data = {
      ...state.data,
      ...editedData,
    };

    return { ...state, ...{ data } };
  },
};
const addUpdateLogger = addUpdateLoggerReducer;
const deleteLogger = deleteLoggerReducer;
const addAppender = addAppenderReducer;
const editAppender = editAppenderReducer;
const addDefaultAppender = {
  next(state, { payload: { events } }) {
    if (state && state.sync) {
      let data = { ...state.data };
      // Go through the events
      events.forEach((dt) => {
        // Update the appenders for this interface
        data.defaultLoggers[dt.interface].loggerData.appenders.push(formatAppender(dt));
      });
      // Modify the state
      return { ...state, ...{ data } };
    }

    return state;
  },
};
const editDefaultAppender = {
  next(state, { payload: { events } }) {
    if (state && state.sync) {
      let data = { ...state.data };
      // Go through the events
      events.forEach((dt) => {
        // Update the appenders for this interface
        data.defaultLoggers[dt.interface].loggerData.appenders = data.defaultLoggers[
          dt.interface
        ].loggerData.appenders.map((appender) => {
          if (appender.id === dt.logger_appenderid) {
            return formatAppender(dt);
          }

          return appender;
        });
      });
      // Modify the state
      return { ...state, ...{ data } };
    }

    return state;
  },
};
const deleteAppender = deleteAppenderReducer;
const deleteDefaultAppender = {
  next(state, { payload: { events } }) {
    if (state && state.sync) {
      let data = { ...state.data };
      // Go through the events
      events.forEach((dt) => {
        // Update the appenders for this interface
        data.defaultLoggers[dt.interface].loggerData.appenders = data.defaultLoggers[
          dt.interface
        ].loggerData.appenders.filter((appender) => appender.id !== dt.logger_appenderid);
      });
      // Modify the state
      return { ...state, ...{ data } };
    }

    return state;
  },
};

const addUpdateDefaultLogger = {
  next(state, { payload: { events } }) {
    if (state && state.sync) {
      let newData = { ...state.data };
      // Check if the defaultLoggers hash exists
      if (!newData.defaultLoggers) {
        newData.defaultLoggers = {};
      }
      // Go through the events
      events.forEach((dt) => {
        // New default logger was added
        if (dt.isNew) {
          // Add the default logger
          newData.defaultLoggers[dt.interface] = {
            loggerData: {
              logger: dt.params,
              appenders: [],
            },
          };
        } else {
          // Get the current items loggerData
          // so we can get the appenders
          newData.defaultLoggers[dt.interface].loggerData.logger = dt.params;
        }
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

// Deleting DEFAULT logger
const deleteDefaultLogger = {
  next(state, { payload: { events } }) {
    if (state && state.sync) {
      let newData = { ...state.data };
      // Go through the events
      events.forEach((dt) => {
        newData.defaultLoggers[dt.interface].loggerData.logger = 'empty';
      });
      // Update interface
      return { ...state, ...{ data: newData } };
    }
    // Return default state
    return state;
  },
};

export {
  addAppender as ADDAPPENDER,
  addDefaultAppender as ADDDEFAULTAPPENDER,
  addProcess as ADDPROCESS,
  addUpdateDefaultLogger as ADDUPDATEDEFAULTLOGGER,
  addUpdateLogger as ADDUPDATELOGGER,
  decrementItems as DECREMENTITEMS,
  deleteAppender as DELETEAPPENDER,
  deleteDefaultAppender as DELETEDEFAULTAPPENDER,
  deleteDefaultLogger as DELETEDEFAULTLOGGER,
  deleteLogger as DELETELOGGER,
  editAppender as EDITAPPENDER,
  editDefaultAppender as EDITDEFAULTAPPENDER,
  fetchDefaultLogger as FETCHDEFAULTLOGGER,
  fetchGlobalConfig as FETCHGLOBALCONFIG,
  fetchLogger as FETCHLOGGER,
  healthChanged as HEALTHCHANGED,
  incrementItems as INCREMENTITEMS,
  init as INIT,
  killProcess as KILLPROCESS,
  processMemoryChanged as PROCESSMEMORYCHANGED,
  remoteHealthChanged as REMOTEHEALTHCHANGED,
  removeNode as REMOVENODE,
  removeProcess as REMOVEPROCESS,
  unsync as UNSYNC,
  updateConfigItemWs as UPDATECONFIGITEMWS,
  updateDone as UPDATEDONE,
  updateLicense as UPDATELICENSE,
  updateNodeInfo as UPDATENODEINFO,
  updateStats as UPDATESTATS,
};
