import { updateItemWithId, setUpdatedToNull } from '../../utils';
import { normalizeId, normalizeName } from '../utils';
import remove from 'lodash/remove';

import {
  select,
  selectAll,
  selectNone,
  selectInvert,
  selectAlerts,
} from '../../../../helpers/resources';


const initialState = { data: [], sync: false, loading: false };

/**
 * Updates service data with new option value.
 *
 * @param {array} data
 * @param {string} serviceId
 * @param {string} name
 * @param {string|number} value
 * @return {array}
 */
function getDataWithOption(data, serviceId, name, value) {
  const service = data.find(w => w.id === serviceId);
  const options = Array.from(service.options);
  const optIdx = options.findIndex(o => o.name === name);

  if (value !== '' && value !== null && optIdx < 0) {
    options.push({ name, value });
  } else if (value !== '' && value !== null) {
    options[optIdx] = Object.assign({}, options[optIdx], { value });
  } else if (optIdx >= 0) {
    options.splice(optIdx, 1);
  }

  return updateItemWithId(
    service.id,
    { options },
    data
  );
}


/**
 * Finds an option in service data.
 *
 * @param {array} data
 * @param {string} serviceId
 * @param {string} name
 * @return {object|null}
 */
function findOption(data, serviceId, name) {
  const service = data.find(w => w.id === serviceId);

  return service ? service.options.find(o => o.name === name) : null;
}


const setOptions = {
  next(state = initialState, action) {
    return Object.assign({}, state, {
      data: getDataWithOption(
        state.data,
        action.meta.serviceId,
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
        action.meta.serviceId,
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
        action.meta.serviceId,
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

const fetchMethodSources = {
  next(state = initialState, action) {
    return Object.assign({}, state, {
      data: updateItemWithId(
        action.meta.serviceId,
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
  next(state = initialState, { payload: { srv } }) {
    if (state.sync) {
      const data = [...state.data, {
        ...normalizeName(normalizeId('serviceid', srv)),
        ...{ _updated: true, desc: srv.description },
      }];

      return { ...state, ...{ data } };
    }

    return state;
  },
};

const setStatus = {
  next(state = initialState, { payload: { events } }) {
    if (state.sync) {
      const data = state.data.slice();
      let newData = data;

      events.forEach(({ id, status }) => {
        newData = updateItemWithId(id, { status, _updated: true }, newData);
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

const setEnabled = {
  next(state, { payload: { events } }) {
    if (state.sync) {
      const data = state.data.slice();
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach(dt => {
        newData = updateItemWithId(dt.id, { enabled: dt.enabled, _updated: true }, newData);
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw(state, action) {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      error: action.payload,
    });
  },
};

const setAutostart = {
  next(state, { payload: { events } }) {
    if (state.sync) {
      const data = state.data.slice();
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach(dt => {
        newData = updateItemWithId(dt.id, { autostart: dt.autostart, _updated: true }, newData);
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw(state, action) {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      error: action.payload,
    });
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
  throw(state, action) {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      error: action.payload,
    });
  },
};

const addAlert = {
  next(state = initialState, { payload: { events } }) {
    if (state.sync) {
      const stateData = [...state.data];
      let newData = stateData;

      events.forEach(dt => {
        const service = newData.find((s) => s.id === parseInt(dt.id, 10));
        const alerts = [...service.alerts, dt];
        newData = updateItemWithId(dt.id, {
          alerts,
          has_alerts: true,
          _updated: true,
        }, newData);
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

      events.forEach(dt => {
        const service = newData.find((s) => s.id === parseInt(dt.id, 10));
        const alerts = [...service.alerts];

        remove(alerts, alert => alert.alertid === parseInt(dt.alertid, 10));

        newData = updateItemWithId(dt.id, {
          alerts,
          has_alerts: !(alerts.length === 0),
          _updated: true,
        }, newData);
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

const selectService = {
  next(state = initialState, { payload: { id } }) {
    return select(state, id);
  },
};

const selectAllServices = {
  next(state = initialState) {
    return selectAll(state);
  },
};

const selectNoneServices = {
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

const serviceAction = {
  next(state = initialState) {
    return state;
  },
};

const unsync = {
  next() {
    return initialState;
  },
};

export {
  setOptions as SETOPTIONS,
  fetchLibSources as FETCHLIBSOURCES,
  fetchMethodSources as FETCHMETHODSOURCES,
  setStatus as SETSTATUS,
  setEnabled as SETENABLED,
  updateDone as UPDATEDONE,
  addAlert as ADDALERT,
  clearAlert as CLEARALERT,
  selectService as SELECT,
  selectAllServices as SELECTALL,
  selectNoneServices as SELECTNONE,
  invertSelection as SELECTINVERT,
  setAutostart as SETAUTOSTART,
  serviceAction as ACTION,
  unsync as UNSYNC,
  addNew as ADDNEW,
  selectWithAlerts as SELECTALERTS,
};
