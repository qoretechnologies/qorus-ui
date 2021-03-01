import remove from 'lodash/remove';
import { objectCollectionToArray } from '../../../../helpers/interfaces';
import {
  select,
  selectAlerts,
  selectAll,
  selectInvert,
  selectNone,
} from '../../../../helpers/resources';
import {
  addAppenderReducer,
  addUpdateLoggerReducer,
  basicDataUpdatedReducer,
  deleteAppenderReducer,
  deleteLoggerReducer,
  editAppenderReducer,
  loggerReducer,
  updateConfigItemWsCommon,
} from '../../common/reducers';
import {
  setUpdatedToNull,
  updateItemWithId,
  updateItemWithName,
} from '../../utils';
import { normalizeId, normalizeName } from '../utils';

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
  const service = data.find((w) => w.id === serviceId);
  const options = Array.from(service.options);
  const optIdx = options.findIndex((o) => o.name === name);

  if (value !== '' && value !== null && optIdx < 0) {
    options.push({ name, value });
  } else if (value !== '' && value !== null) {
    options[optIdx] = Object.assign({}, options[optIdx], { value });
  } else if (optIdx >= 0) {
    options.splice(optIdx, 1);
  }

  return updateItemWithId(service.id, { options }, data);
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
  const service = data.find((w) => w.id === serviceId);

  return service ? service.options.find((o) => o.name === name) : null;
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

const updateBasicData = basicDataUpdatedReducer;

const fetchLibSources = {
  next(state = initialState, action) {
    const service: Object = state.data.find(
      (datum: Object) => datum.id === parseInt(action.meta.serviceId, 10)
    );

    return Object.assign({}, state, {
      data: !service
        ? [...state.data, action.payload]
        : updateItemWithId(action.meta.serviceId, action.payload, state.data),
      sync: true,
      loading: false,
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
      data: updateItemWithId(action.meta.serviceId, action.payload, state.data),
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
      const data = [
        ...state.data,
        {
          ...normalizeName(normalizeId('serviceid', srv)),
          ...{ _updated: true, desc: srv.description },
        },
      ];

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

      events.forEach((dt) => {
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

      events.forEach((dt) => {
        newData = updateItemWithId(
          dt.id,
          { autostart: dt.autostart, _updated: true },
          newData
        );
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

      events.forEach((dt) => {
        const service = newData.find((s) => s.id === parseInt(dt.id, 10));
        const alerts = [...service.alerts, dt];
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
        const service = newData.find((s) => s.id === parseInt(dt.id, 10));
        const alerts = [...service.alerts];

        remove(alerts, (alert) => alert.alertid === parseInt(dt.alertid, 10));

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

const setRemote = {
  next(state = initialState) {
    return state;
  },
};

const unsync = {
  next() {
    return initialState;
  },
};

const updateConfigItemWs = updateConfigItemWsCommon;
const processStarted = {
  next(state, { payload: { events } }) {
    if (state && state.sync) {
      const data = state.data.slice();
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach((dt) => {
        let processes =
          newData.find((service) => service.id === dt.id)?.processes || [];

        if (dt.started) {
          processes.push(dt.info);
        } else {
          processes = processes.reduce((newProc, prcs) => {
            if (prcs.pid === dt.info.pid) {
              return [...newProc, dt.info];
            }

            return [...newProc, prcs];
          }, []);
        }

        newData = updateItemWithId(
          dt.id,
          { processes, _updated: true },
          newData
        );
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

const processStopped = {
  next(state, { payload: { events } }) {
    if (state && state.sync) {
      const data = state.data.slice();
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach((dt) => {
        let processes =
          newData.find((service) => service.id === dt.id)?.processes || [];

        processes = processes.reduce((newProc, prcs) => {
          if (prcs.pid === dt.info.pid) {
            return [...newProc];
          }

          return [...newProc, prcs];
        }, []);

        newData = updateItemWithId(
          dt.id,
          { processes, _updated: true },
          newData
        );
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

// LOGGER
const fetchLogger = loggerReducer;
const addUpdateLogger = addUpdateLoggerReducer;
const deleteLogger = deleteLoggerReducer;
const addAppender = addAppenderReducer;
const editAppender = editAppenderReducer;
const deleteAppender = deleteAppenderReducer;

// AUTHLABELS
const fetchAuthLabels = {
  next(state = initialState, { payload: { authLabels, id } }) {
    const stateData = [...state.data];
    const newData = updateItemWithId(
      id,
      {
        authLabels:
          authLabels === 'success' ? [] : objectCollectionToArray(authLabels),
      },
      stateData
    );

    return { ...state, ...{ data: newData } };
  },
};

const updateAuthLabel = {
  next(state, { payload: { name, value, id } }) {
    const data = [...state.data];
    const service: Object = data.find(
      (srvc: Object): boolean => srvc.id === id
    );

    if (service) {
      let { authLabels } = service;

      authLabels = updateItemWithName(name, { value }, authLabels);

      const newData = updateItemWithId(id, { authLabels }, data);

      return { ...state, ...{ data: newData } };
    }

    return state;
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
  setRemote as SETREMOTE,
  updateConfigItemWs as UPDATECONFIGITEMWS,
  processStarted as PROCESSSTARTED,
  processStopped as PROCESSSTOPPED,
  updateBasicData as UPDATEBASICDATA,
  fetchLogger as FETCHLOGGER,
  addUpdateLogger as ADDUPDATELOGGER,
  deleteLogger as DELETELOGGER,
  addAppender as ADDAPPENDER,
  editAppender as EDITAPPENDER,
  deleteAppender as DELETEAPPENDER,
  fetchAuthLabels as FETCHAUTHLABELS,
  updateAuthLabel as UPDATEAUTHLABEL,
};
