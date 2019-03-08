import { updateItemWithName } from '../../utils';

import {
  loggerReducer,
  addUpdateLoggerReducer,
  deleteLoggerReducer,
  addAppenderReducer,
  deleteAppenderReducer,
} from '../../common/reducers';

const addProcess = {
  next (
    state: Object,
    {
      payload: { events },
    }
  ) {
    const data = { ...state.data };
    const processes = { ...data.processes };
    const newProcesses = events.reduce(
      (cur, event) =>
        event.status === 0 ? cur : { ...processes, ...{ [event.id]: event } },
      processes
    );

    const newData = { ...data, ...{ processes: newProcesses } };

    return { ...state, ...{ data: newData } };
  },
};

const removeProcess = {
  next (
    state: Object,
    {
      payload: { events },
    }
  ) {
    const data = { ...state.data };
    const processes = { ...data.processes };

    events.forEach(event => {
      delete processes[event.id];
    });

    const newData = { ...data, ...{ processes } };

    return { ...state, ...{ data: newData } };
  },
};

const processMemoryChanged = {
  next (
    state: Object,
    {
      payload: { events },
    }
  ) {
    const data = { ...state.data };
    const processes = { ...data.processes };

    if (data.cluster_info) {
      events.forEach(event => {
        data.cluster_info[event.node].node_priv = event.node_priv;
        data.cluster_info[event.node].node_load_pct = event.node_load_pct;
        data.cluster_info[event.node].node_ram_in_use = event.node_ram_in_use;
        data.cluster_info[event.node].node_priv_str = event.node_priv_str;
        data.cluster_info[event.node].node_ram_in_use_str =
          event.node_ram_in_use_str;

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
  next (
    state: Object,
    {
      payload: { events },
    }
  ) {
    const data = { ...state.data };

    events.forEach(event => {
      if (event.alert) {
        data['alert-summary'][event.alertType] =
          data['alert-summary'][event.alertType] + 1;
      }

      if (event.type) {
        data[event.type] = data[event.type] + 1;
      }
    });

    return { ...state, ...{ data } };
  },
};

const decrementItems = {
  next (
    state: Object,
    {
      payload: { events },
    }
  ) {
    const data = { ...state.data };

    events.forEach(event => {
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
  next (
    state: Object,
    {
      payload: { id },
    }
  ) {
    const data = { ...state.data };
    const processes = { ...data.processes };

    processes[id]._updated = null;

    const newData = { ...data, ...{ processes } };

    return { ...state, ...{ data: newData } };
  },
};

const init = {
  next (state: Object) {
    const newState = { ...state };

    newState.isOnDashboard = true;

    return { ...newState };
  },
};

const unsync = {
  next (state: Object) {
    const newState = { ...state };

    newState.isOnDashboard = false;

    return { ...newState };
  },
};

const killProcess = {
  next (state: Object) {
    return state;
  },
};

const updateStats = {
  next (
    state: Object,
    {
      payload: { events },
    }
  ) {
    const data = { ...state.data };

    events.forEach(event => {
      data.order_stats = event.bands;
    });

    return { ...state, ...{ data } };
  },
};

const healthChanged = {
  next (
    state: Object,
    {
      payload: { events },
    }
  ) {
    const data = { ...state.data };

    events.forEach(event => {
      data.health.health = event.health;
      data.health.ongoing = event.ongoing;
      data.health.transient = event.transient;
    });

    return { ...state, ...{ data } };
  },
};

const remoteHealthChanged = {
  next (
    state: Object,
    {
      payload: { events },
    }
  ) {
    const data = { ...state.data };

    events.forEach(event => {
      const remote = data.health.remote(
        (rm: Object): boolean => rm.name === event.name
      );

      if (remote) {
        remote.health = event.health;
      }
    });

    return { ...state, ...{ data } };
  },
};

const updateNodeInfo = {
  next (
    state: Object,
    {
      payload: { events },
    }
  ) {
    const data = { ...state.data };

    events.forEach(event => {
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

      if (data.cluster_info[event.name].process_history.length > 60) {
        data.cluster_info[event.name].process_history.shift();
      }
    });

    return { ...state, ...{ data } };
  },
};

// Global Config
const fetchGlobalConfig = {
  next (
    state: Object,
    {
      payload: { globalConfig },
    }
  ) {
    const newState = { ...state };

    newState.globalConfig = globalConfig;

    return { ...newState };
  },
};

const updateGlobalConfigItemWs = {
  next (
    state: Object,
    {
      payload: { events },
    }
  ) {
    const newState = { ...state };

    events.forEach(event => {
      const globalConfig = updateItemWithName(
        event.item,
        { value: event.value },
        [...state.globalConfig],
        'item'
      );

      newState.globalConfig = globalConfig;
    });

    return { ...newState };
  },
};

// LOGGER
const fetchLogger = loggerReducer;
const addUpdateLogger = addUpdateLoggerReducer;
const deleteLogger = deleteLoggerReducer;
const addAppender = addAppenderReducer;
const deleteAppender = deleteAppenderReducer;

export {
  addProcess as ADDPROCESS,
  removeProcess as REMOVEPROCESS,
  processMemoryChanged as PROCESSMEMORYCHANGED,
  updateDone as UPDATEDONE,
  incrementItems as INCREMENTITEMS,
  decrementItems as DECREMENTITEMS,
  updateStats as UPDATESTATS,
  updateNodeInfo as UPDATENODEINFO,
  init as INIT,
  unsync as UNSYNC,
  healthChanged as HEALTHCHANGED,
  remoteHealthChanged as REMOTEHEALTHCHANGED,
  killProcess as KILLPROCESS,
  fetchGlobalConfig as FETCHGLOBALCONFIG,
  updateGlobalConfigItemWs as UPDATEGLOBALCONFIGITEMWS,
  fetchLogger as FETCHLOGGER,
  addUpdateLogger as ADDUPDATELOGGER,
  deleteLogger as DELETELOGGER,
  addAppender as ADDAPPENDER,
  deleteAppender as DELETEAPPENDER,
};
