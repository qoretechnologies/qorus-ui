const addProcess = {
  next(
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
  next(
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
  next(
    state: Object,
    {
      payload: { events },
    }
  ) {
    const data = { ...state.data };
    const processes = { ...data.processes };

    events.forEach(event => {
      data.cluster_info[event.node].node_priv = event.node_priv;
      data.cluster_info[event.node].node_priv_str = event.node_priv_str;

      if (event.status_string === 'IDLE') {
        delete processes[event.id];
      } else {
        processes[event.id] = { ...event, ...{ _updated: true } };
      }
    });

    const newData = { ...data, ...{ processes } };

    return { ...state, ...{ data: newData } };
  },
};

const incrementItems = {
  next(
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
  next(
    state: Object,
    {
      payload: { events },
    }
  ) {
    const data = { ...state.data };

    events.forEach(event => {
      if (event.alert) {
        data['alert-summary'][event.alertType] =
          data['alert-summary'][event.alertType] - 1;
      }

      if (event.type) {
        data[event.type] = data[event.type] - 1;
      }
    });

    return { ...state, ...{ data } };
  },
};

const updateDone = {
  next(
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
  next(state: Object) {
    const newState = { ...state };

    newState.isOnDashboard = true;

    return { ...newState };
  },
};

const unsync = {
  next(state: Object) {
    const newState = { ...state };

    newState.isOnDashboard = false;

    return { ...newState };
  },
};

const updateStats = {
  next(
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
  next(
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
  next(
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
  next(
    state: Object,
    {
      payload: { events },
    }
  ) {
    const data = { ...state.data };

    events.forEach(event => {
      data.cluster_info[event.name].mem_history.push({
        node_priv: event.node_priv,
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

      if (data.cluster_info[event.name].process_history.length > 60) {
        data.cluster_info[event.name].process_history.shift();
      }
    });

    return { ...state, ...{ data } };
  },
};

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
};
