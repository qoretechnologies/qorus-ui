import { updateItemWithId, setUpdatedToNull } from '../../utils';
import { normalizeId } from '../utils';
import remove from 'lodash/remove';
import includes from 'lodash/includes';

import {
  select,
  selectAll,
  selectNone,
  selectInvert,
  selectAlerts,
} from '../../../../helpers/resources';

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

  return updateItemWithId(workflow.id, { options }, data);
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

const addNew = {
  next(
    state = initialState,
    {
      payload: { wf },
    }
  ) {
    if (state.sync) {
      const data = [
        ...state.data,
        { ...normalizeId('workflowid', wf), ...{ _updated: true } },
      ];

      return { ...state, ...{ data } };
    }

    return state;
  },
};

const setExecCount = {
  next(
    state = initialState,
    {
      payload: { events },
    }
  ) {
    if (state.sync) {
      const data = state.data.slice();
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach(dt => {
        const workflow = newData.find(d => d.id === dt.id);
        const execCount =
          workflow.exec_count + dt.value < 0
            ? 0
            : workflow.exec_count + dt.value;
        newData = updateItemWithId(
          dt.id,
          { exec_count: execCount, _updated: true },
          newData
        );
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

const setEnabled = {
  next(
    state,
    {
      payload: { events },
    }
  ) {
    if (state.sync) {
      const data = [...state.data];
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach(dt => {
        newData = updateItemWithId(
          dt.id,
          { enabled: dt.enabled, _updated: true },
          newData
        );
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

const updateStats = {
  next(
    state,
    {
      payload: { events },
    }
  ) {
    if (state.sync) {
      const data = [...state.data];
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach(dt => {
        newData = updateItemWithId(
          parseInt(dt.tag, 10),
          { order_stats: dt.bands },
          newData
        );
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

const unselectAll = {
  next(state) {
    const data = [...state.data];
    const newData = data.map(
      // eslint-disable-next-line
      w =>
        w._selected
          ? {
              ...w,
              ...{ _selected: false },
            }
          : w
    );

    return { ...state, ...{ data: newData } };
  },
};

const updateDone = {
  next(
    state,
    {
      payload: { id },
    }
  ) {
    if (state.sync) {
      const data = state.data.slice();
      const newData = updateItemWithId(id, { _updated: null }, data);

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

const addOrder = {
  next(
    state = initialState,
    {
      payload: { events },
    }
  ) {
    if (state.sync) {
      const data = [...state.data];
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach(dt => {
        const workflow = newData.find(d => d.id === dt.id);
        const newStatus = workflow[dt.status] + 1;
        const newTotal = workflow.TOTAL + 1;

        newData = updateItemWithId(
          dt.id,
          {
            [dt.status]: newStatus,
            TOTAL: newTotal,
            _updated: true,
          },
          newData
        );
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

const modifyOrder = {
  next(
    state = initialState,
    {
      payload: { events },
    }
  ) {
    if (state.sync) {
      const data = [...state.data];
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach(dt => {
        const workflow = newData.find(d => d.id === dt.id);
        const statusBefore =
          workflow[dt.old] - 1 < 0 ? 0 : workflow[dt.old] - 1;
        const status = workflow[dt.new] + 1;
        newData = updateItemWithId(
          dt.id,
          {
            [dt.old]: statusBefore,
            [dt.new]: status,
            _updated: true,
          },
          newData
        );
      });

      return { ...state, ...{ data: newData } };
    }

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
      const updatedData = setUpdatedToNull(stateData);
      let newData = updatedData;

      events.forEach(dt => {
        const workflow = newData.find(w => w.id === parseInt(dt.id, 10));
        const alerts = [...workflow.alerts, dt];
        newData = updateItemWithId(
          dt.id,
          {
            alerts,
            has_alerts: true,
            _updated: true,
          },
          newData
        );
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
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
        const workflow = newData.find(w => w.id === parseInt(dt.id, 10));
        const alerts = [...workflow.alerts];

        remove(alerts, alert => alert.alertid === parseInt(dt.alertid, 10));

        newData = updateItemWithId(
          dt.id,
          {
            alerts,
            has_alerts: !(alerts.length === 0),
            _updated: true,
          },
          newData
        );
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

const selectWorkflow = {
  next(
    state = initialState,
    {
      payload: { id },
    }
  ) {
    return select(state, id);
  },
};

const selectAllWorkflows = {
  next(state = initialState) {
    return selectAll(state);
  },
};

const selectNoneWorkflows = {
  next(state = initialState) {
    return selectNone(state);
  },
};

const invertSelection = {
  next(state = initialState) {
    return selectInvert(state);
  },
};

const selectWithAlerts = {
  next(state = initialState) {
    return selectAlerts(state);
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
  next(
    state = initialState,
    {
      payload: { ids, value },
    }
  ) {
    const data = [...state.data];
    const newData = data.map(w => {
      if (includes(ids, w.id)) {
        return { ...w, ...{ deprecated: value } };
      }

      return w;
    });

    return { ...state, ...{ data: newData } };
  },
};

const setAutostart = {
  next(
    state = initialState,
    {
      payload: { id, value },
    }
  ) {
    const stateData = [...state.data];
    const newData = updateItemWithId(id, { autostart: value }, stateData);

    return { ...state, ...{ data: newData } };
  },
};

const setThreshold = {
  next(
    state = initialState,
    {
      payload: { id, value },
    }
  ) {
    const stateData = [...state.data];
    const newData = updateItemWithId(id, { sla_threshold: value }, stateData);

    return { ...state, ...{ data: newData } };
  },
};

const setRemote = {
  next(
    state = initialState,
    {
      payload: { id, value },
    }
  ) {
    const stateData = [...state.data];
    const newData = updateItemWithId(id, { remote: value }, stateData);

    return { ...state, ...{ data: newData } };
  },
};

const unsync = {
  next() {
    return { ...initialState };
  },
};

const fetchList = {
  next(
    state = initialState,
    {
      payload: { result },
    }
  ) {
    return { ...state, ...{ data: result, sync: true, loading: false } };
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
  selectAllWorkflows as SELECTALL,
  selectNoneWorkflows as SELECTNONE,
  invertSelection as SELECTINVERT,
  selectRunning as SELECTRUNNING,
  selectStopped as SELECTSTOPPED,
  selectWithAlerts as SELECTALERTS,
  setAutostart as SETAUTOSTART,
  unselectAll as UNSELECTALL,
  setDeprecated as TOGGLEDEPRECATED,
  fetchList as FETCHLIST,
  addNew as ADDNEW,
  updateStats as UPDATESTATS,
  setThreshold as SETTHRESHOLD,
  setRemote as SETREMOTE,
};
