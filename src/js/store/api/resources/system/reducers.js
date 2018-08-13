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
      data.cluster_info[event.node].mem_history.push({
        node_priv: event.node_priv,
        node_priv_str: event.node_priv_str,
        timestamp: new Date(),
      });

      if (data.cluster_info[event.node].mem_history.length > 10) {
        data.cluster_info[event.node].mem_history.shift();
      }

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
      data[event.type] = data[event.type] + 1;
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

export {
  addProcess as ADDPROCESS,
  removeProcess as REMOVEPROCESS,
  processMemoryChanged as PROCESSMEMORYCHANGED,
  updateDone as UPDATEDONE,
  incrementItems as INCREMENTITEMS,
  updateStats as UPDATESTATS,
};
