const addProcess = {
  next(state: Object, { payload: { events } }) {
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
  next(state: Object, { payload: { events } }) {
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
  next(state: Object, { payload: { events } }) {
    const data = { ...state.data };
    const processes = { ...data.processes };

    events.forEach(event => {
      data.cluster_memory[event.node] = event.node_priv;

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
  next(state: Object, { payload: { events } }) {
    const data = { ...state.data };

    events.forEach(event => {
      console.log('incrementing', event);

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
  next(state: Object, { payload: { id } }) {
    const data = { ...state.data };
    const processes = { ...data.processes };

    processes[id]._updated = null;

    const newData = { ...data, ...{ processes } };

    return { ...state, ...{ data: newData } };
  },
};

export {
  addProcess as ADDPROCESS,
  removeProcess as REMOVEPROCESS,
  processMemoryChanged as PROCESSMEMORYCHANGED,
  updateDone as UPDATEDONE,
  incrementItems as INCREMENTITEMS,
};
