import { updateItemWithId } from '../../utils';


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


export {
  setOptions as SETOPTIONS,
  fetchLibSources as FETCHLIBSOURCES,
  fetchMethodSources as FETCHMETHODSOURCES,
};
