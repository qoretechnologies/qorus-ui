import { updateItemWithId } from '../../utils';


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


export {
  setOptions as SETOPTIONS,
  fetchLibSources as FETCHLIBSOURCES,
};
