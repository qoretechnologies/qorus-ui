import _ from 'lodash';
import remove from 'lodash/remove';

import { updateItemWithId, setUpdatedToNull } from '../../utils';

const initialState = { data: [], sync: false, loading: false };

const setOptions = {
  /**
   * Update job with new option. if action is optimistic then add oldOption to option.
   * @param state
   * @param action
   * @returns {{data: *}}
   */
  next(state = initialState, action) {
    const { payload: { option }, meta: { modelId, optimistic } } = action;

    const model = state.data.find(job => job.id === modelId);
    const { options = [] } = model;
    let newOptions;
    const oldOption = options.find(item => item.name === option.name);

    if (optimistic) {
      option.oldOption = oldOption;
      option.optimistic = true;
    }

    if (oldOption) {
      newOptions = options.map(item => (item.name === option.name ? option : item));
    } else {
      newOptions = [...options, option];
    }

    return { ...state, data: updateItemWithId(modelId, { options: newOptions }, state.data) };
  },
  /**
   * If get option by meta.option.name and replace it with oldOption
   * @param state
   * @param action
   * @returns {{data: Array, sync: boolean, loading: boolean}}
   */
  throw(state = initialState, action) {
    const { meta: { modelId, option } } = action;
    const model = state.data.find(job => job.id === modelId);
    const { options } = model;
    return {
      ...state,
      data: updateItemWithId(
        modelId,
        { options: options
          .map(item => (item.name === option.name ? item.oldOption : item))
          .filter(item => item),
        },
        state.data
      ),
    };
  },
};

const fetchLibSources = {
  next(state = initialState, action) {
    return Object.assign({}, state, {
      data: updateItemWithId(
        action.meta.modelId,
        { ...action.payload, loading: false, sync: true },
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

const startFetchingResults = {
  next(state, action) {
    const { modelId } = action.meta;
    const job = state.data.find(item => item.id === modelId);
    if (!job) {
      return state;
    }

    const { results = {} } = job;
    results.loading = true;
    const newJob = { ...job, results };

    return {
      ...state,
      data: updateItemWithId(modelId, newJob, state.data),
    };
  },
  throw(state) { return state; },
};

const fetchResults = {
  next(state, action) {
    const { modelId, offset, limit } = action.meta;
    const job = state.data.find(item => item.id === modelId);
    if (!job) {
      return state;
    }

    const { results: { data: resultsData = [] } = {} } = job;
    job.results = {
      offset,
      limit,
      loading: false,
      sync: true,
      data: _.uniqBy([...resultsData, ...action.payload], item => item.job_instanceid),
      hasMore: action.payload && action.payload.length === limit,
    };

    return {
      ...state,
      data: updateItemWithId(modelId, job, state.data),
    };
  },
  throw(state) {
    return state;
  },
};

const clearResults = {
  next(state, action) {
    const { modelId } = action.meta;
    const job = state.data.find(item => item.id === modelId);
    if (!job) {
      return state;
    }

    job.results = {
      loading: false,
      sync: false,
      data: [],
    };

    return { ...state, data: updateItemWithId(modelId, job, state.data) };
  },
  throw(state) {
    return state;
  },
};

const setExpirationDate = {
  next(state, action) {
    const { meta: { job }, payload: updatedJob } = action;
    return { ...state, data: updateItemWithId(job.id, updatedJob, state.data) };
  },
  throw(state, action) {
    const { meta: { job } } = action;
    return { ...state, data: updateItemWithId(job.id, job, state.data) };
  },
};

const fetchCode = {
  next(state, action) {
    const { meta: { job }, payload: { code } } = action;
    const updatedJob = { ...job, code };
    return { ...state, data: updateItemWithId(job.id, updatedJob, state.data) };
  },
  throw(state) {
    return state;
  },
};

const setActive = {
  next(state, { payload: { id, value } }) {
    if (state.sync) {
      const data = state.data.slice();
      const newData = updateItemWithId(id, { active: value, _updated: true }, data);

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw(state) {
    return state;
  },
};

const setEnabled = {
  next(state, { payload: { id, value } }) {
    if (state.sync) {
      const data = state.data.slice();
      const updatedData = setUpdatedToNull(data);
      const newData = updateItemWithId(id, { enabled: value, _updated: true }, updatedData);

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

const instanceUpdateDone = {
  next(state, { payload: { jobid, id } }) {
    const data = state.data.slice();
    const job = data.find(d => d.id === jobid);

    if (job) {
      const instanceData = job.results.data.slice();
      const newInstanceData = updateItemWithId(id, { _updated: null }, instanceData);
      const newData = updateItemWithId(jobid, {
        results: { ...job.results, ...{ data: newInstanceData } },
      }, data);

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

const addInstance = {
  next(state, { payload: { data: { jobid, job_instanceid, name, version }, started } }) {
    const data = state.data.slice();
    const job = data.find(d => d.id === jobid);

    if (job) {
      let newData;
      const updatedData = setUpdatedToNull(data);

      if (job.results && job.results.sync) {
        const resultData = job.results.data.slice();
        const updatedResultData = setUpdatedToNull(resultData);
        const newResultData = [...updatedResultData, {
          jobid,
          job_instanceid,
          id: job_instanceid,
          name,
          version,
          started,
          jobstatus: 'IN-PROGRESS',
          _updated: true,
        }];

        newData = updateItemWithId(jobid, {
          results: { ...job.results, ...{ data: newResultData } },
        }, updatedData);
      } else {
        const progressCount = job['IN-PROGRESS'] ? job['IN-PROGRESS'] + 1 : 1;

        newData = updateItemWithId(jobid, {
          _updated: true,
          'IN-PROGRESS': progressCount,
        }, updatedData);
      }

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

const modifyInstance = {
  next(state, { payload: { data: { jobid, job_instanceid, status }, modified } }) {
    const data = state.data.slice();
    const job = data.find(d => d.id === jobid);

    if (job) {
      let newData;
      const updatedData = setUpdatedToNull(data);

      if (job.results && job.results.sync) {
        const instances = job.results.data.slice();
        const updatedInstances = setUpdatedToNull(instances);
        const resultsData = updateItemWithId(job_instanceid, {
          _updated: true,
          jobstatus: status,
          modified,
        }, updatedInstances);

        newData = updateItemWithId(jobid, {
          results: { ...job.results, ...{ data: resultsData } },
        }, updatedData);
      } else {
        const progressCount = !job['IN-PROGRESS'] || job['IN-PROGRESS'] - 1 < 0 ?
          0 : job['IN-PROGRESS'] - 1;
        const statusCount = job[status] ? job[status] + 1 : 1;

        newData = updateItemWithId(jobid, {
          _updated: true,
          'IN-PROGRESS': progressCount,
          [status]: statusCount,
        }, updatedData);
      }

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
  next(state = initialState, { payload: { data } }) {
    if (state.sync) {
      const stateData = [...state.data];
      const job = stateData.find((s) => s.id === parseInt(data.id, 10));
      const alerts = [...job.alerts, data];
      const newData = updateItemWithId(data.id, {
        alerts,
        has_alerts: true,
        _updated: true,
      }, stateData);

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
  next(state = initialState, { payload: { id, alertid } }) {
    if (state.sync) {
      const stateData = [...state.data];
      const job = stateData.find((s) => s.id === parseInt(id, 10));
      const alerts = [...job.alerts];

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
  throw(state = initialState, action) {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      error: action.payload,
    });
  },
};

export {
  setOptions as SETOPTIONS,
  fetchLibSources as FETCHLIBSOURCES,
  fetchResults as FETCHRESULTS,
  startFetchingResults as STARTFETCHINGRESULTS,
  clearResults as CLEARRESULTS,
  setExpirationDate as SETEXPIRATIONDATE,
  fetchCode as FETCHCODE,
  setActive as SETACTIVE,
  setEnabled as SETENABLED,
  updateDone as UPDATEDONE,
  instanceUpdateDone as INSTANCEUPDATEDONE,
  addInstance as ADDINSTANCE,
  modifyInstance as MODIFYINSTANCE,
  addAlert as ADDALERT,
  clearAlert as CLEARALERT,
};
