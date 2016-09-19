import _ from 'lodash';

import { updateItemWithId } from '../../utils';


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

export {
  setOptions as SETOPTIONS,
  fetchLibSources as FETCHLIBSOURCES,
  fetchResults as FETCHRESULTS,
  startFetchingResults as STARTFETCHINGRESULTS,
  clearResults as CLEARRESULTS,
  setExpirationDate as SETEXPIRATIONDATE,
  fetchCode as FETCHCODE,
};
