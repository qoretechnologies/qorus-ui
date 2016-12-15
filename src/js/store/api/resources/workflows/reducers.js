import { updateItemWithId, setUpdatedToNull } from '../../utils';
import remove from 'lodash/remove';
import includes from 'lodash/includes';

const initialState = { data: [], sync: false, loading: false };

/**
 * Updates workflow data with new option value.
 *
 * @param {array} data
 * @param {string} workflowId
 * @param {string} name
 * @param {string|number} value
 * @return {array}
 */
function getDataWithOption(data, workflowId, name, value) {
  const workflow = data.find(w => w.id === workflowId);
  const options = Array.from(workflow.options);
  const optIdx = options.findIndex(o => o.name === name);

  if (value !== '' && value !== null && optIdx < 0) {
    options.push({ name, value });
  } else if (value !== '' && value !== null) {
    options[optIdx] = Object.assign({}, options[optIdx], { value });
  } else if (optIdx >= 0) {
    options.splice(optIdx, 1);
  }

  return updateItemWithId(
    workflow.id,
    { options },
    data
  );
}


/**
 * Finds an option in workflow data.
 *
 * @param {array} data
 * @param {string} workflowId
 * @param {string} name
 * @return {object|null}
 */
function findOption(data, workflowId, name) {
  const workflow = data.find(w => w.id === workflowId);

  return workflow ? workflow.options.find(o => o.name === name) : null;
}


const setOptions = {
  next(state = initialState, action) {
    return Object.assign({}, state, {
      data: getDataWithOption(
        state.data,
        action.meta.workflowId,
        action.meta.option.name,
        action.meta.option.value
      ),
    });
  },
  throw(state = initialState, action) {
    const option = findOption(state.data, action.meta.option.name);

    return Object.assign({}, state, {
      data: getDataWithOption(
        state.data,
        action.meta.workflowId,
        action.meta.option.name,
        option && option.value
      ),
      sync: false,
      loading: false,
      error: action.payload,
    });
  },
};


const fetchLibSources = {
  next(state = initialState, action) {
    return Object.assign({}, state, {
      data: updateItemWithId(
        action.meta.workflowId,
        action.payload,
        state.data
      ),
    });
  },
  throw(state = initialState, action) {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      error: action.payload,
    });
  },
};

const setExecCount = {
  next(state = initialState, { payload: { workflowid, value } }) {
    if (state.sync) {
      const data = state.data.slice();
      const workflow = data.find(d => d.id === workflowid);
      const execCount = workflow.exec_count + value < 0 ? 0 : workflow.exec_count + value;
      const updatedData = setUpdatedToNull(data);
      const newData = updateItemWithId(
        workflowid,
        { exec_count: execCount, _updated: true },
        updatedData
      );

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

const setEnabled = {
  next(state, { payload: { workflowid, value, update = true } }) {
    if (state.sync) {
      const data = [...state.data];
      const updatedData = setUpdatedToNull(data);
      const props = update ? { enabled: value, _updated: true } : { enabled: value };
      const newData = updateItemWithId(workflowid, props, updatedData);

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

const unselectAll = {
  next(state) {
    const data = [...state.data];
    const newData = data.map(w => (
      w._selected ? ({
        ...w,
        ...{ _selected: false },
      }) : w)
    );

    return { ...state, ...{ data: newData } };
  },
};


const updateDone = {
  next(state, { payload: { id } }) {
    if (state.sync) {
      const data = state.data.slice();
      const newData = updateItemWithId(id, { _updated: null }, data);

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

const addOrder = {
  next(state = initialState, { payload: { id, status } }) {
    if (state.sync) {
      const data = [...state.data];
      const updatedData = setUpdatedToNull(data);
      const workflow = data.find(d => d.id === id);
      const newStatus = workflow[status] + 1;
      const newTotal = workflow.TOTAL + 1;
      const newData = updateItemWithId(id, {
        [status]: newStatus,
        TOTAL: newTotal,
        _updated: true,
      }, updatedData);

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

const modifyOrder = {
  next(state = initialState, { payload: { id, oldStatus, newStatus } }) {
    if (state.sync) {
      const data = [...state.data];
      const updatedData = setUpdatedToNull(data);
      const workflow = data.find(d => d.id === id);
      const statusBefore = workflow[oldStatus] - 1 < 0 ? 0 : workflow[oldStatus] - 1;
      const status = workflow[newStatus] + 1;
      const newData = updateItemWithId(id, {
        [oldStatus]: statusBefore,
        [newStatus]: status,
        _updated: true,
      }, updatedData);

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

const addAlert = {
  next(state = initialState, { payload: { data } }) {
    if (state.sync) {
      const stateData = [...state.data];
      const workflow = stateData.find((w) => w.id === parseInt(data.id, 10));
      const alerts = [...workflow.alerts, data];
      const newData = updateItemWithId(data.id, {
        alerts,
        has_alerts: true,
        _updated: true,
      }, stateData);

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

const clearAlert = {
  next(state = initialState, { payload: { id, alertid } }) {
    if (state.sync) {
      const stateData = [...state.data];
      const workflow = stateData.find((w) => w.id === parseInt(id, 10));
      const alerts = [...workflow.alerts];

      remove(alerts, alert => alert.alertid === parseInt(alertid, 10));

      const newData = updateItemWithId(id, {
        alerts,
        has_alerts: !(alerts.length === 0),
        _updated: true,
      }, stateData);

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

const selectWorkflow = {
  next(state = initialState, { payload: { id } }) {
    const stateData = [...state.data];
    const workflow = stateData.find((w) => w.id === parseInt(id, 10));
    const newData = updateItemWithId(id, { _selected: !workflow._selected }, stateData);

    return { ...state, ...{ data: newData } };
  },
};

const selectAll = {
  next(state = initialState) {
    const data = [...state.data];
    const newData = data.map(w => ({ ...w, ...{ _selected: true } }));

    return { ...state, ...{ data: newData } };
  },
};

const selectNone = {
  next(state = initialState) {
    const data = [...state.data];
    const newData = data.map(w => {
      const copy = { ...w };

      if (w._selected) {
        copy._selected = null;
      }

      return copy;
    });

    return { ...state, ...{ data: newData } };
  },
};

const selectInvert = {
  next(state = initialState) {
    const data = [...state.data];
    const newData = data.map(w => ({ ...w, ...{ _selected: !w._selected } }));

    return { ...state, ...{ data: newData } };
  },
};

const selectRunning = {
  next(state = initialState) {
    const data = [...state.data];
    const newData = data.map(w => {
      const copy = { ...w };

      if (w.exec_count > 0) {
        copy._selected = true;
      } else {
        if (w._selected) copy._selected = null;
      }

      return copy;
    });

    return { ...state, ...{ data: newData } };
  },
};

const selectStopped = {
  next(state = initialState) {
    const data = [...state.data];
    const newData = data.map(w => {
      const copy = { ...w };

      if (w.exec_count === 0) {
        copy._selected = true;
      } else {
        if (w._selected) copy._selected = null;
      }

      return copy;
    });

    return { ...state, ...{ data: newData } };
  },
};

const setDeprecated = {
  next(state = initialState, { payload: { ids, value } }) {
    const data = [...state.data];
    const newData = data.map((w) => {
      if (includes(ids, w.id)) {
        return { ...w, ...{ deprecated: value } };
      }

      return w;
    });

    return { ...state, ...{ data: newData } };
  },
};

const setAutostart = {
  next(state = initialState, { payload: { id, value } }) {
    const stateData = [...state.data];
    const newData = updateItemWithId(id, { autostart: value }, stateData);

    return { ...state, ...{ data: newData } };
  },
};

const unsync = {
  next() {
    return { ...initialState };
  },
};

export {
  setOptions as SETOPTIONS,
  fetchLibSources as FETCHLIBSOURCES,
  setExecCount as SETEXECCOUNT,
  addOrder as ADDORDER,
  modifyOrder as MODIFYORDER,
  setEnabled as SETENABLED,
  updateDone as UPDATEDONE,
  addAlert as ADDALERT,
  clearAlert as CLEARALERT,
  unsync as UNSYNC,
  selectWorkflow as SELECT,
  selectAll as SELECTALL,
  selectNone as SELECTNONE,
  selectInvert as SELECTINVERT,
  selectRunning as SELECTRUNNING,
  selectStopped as SELECTSTOPPED,
  setAutostart as SETAUTOSTART,
  unselectAll as UNSELECTALL,
  setDeprecated as TOGGLEDEPRECATED,
};
