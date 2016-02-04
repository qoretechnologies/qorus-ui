function ensureStructure(state = {}, action) {
  if (state[action.meta.ref]) return state;

  return Object.assign({}, state, {
    [action.meta.ref]: {
      data: {},
      sync: false,
      loading: false,
    },
  });
}


function handleError(state = {}, action) {
  return Object.assign({}, state, {
    [action.meta.ref]: Object.assign({}, state[action.meta.ref], {
      sync: false,
      loading: false,
      error: action.payload,
    }),
  });
}


const fetch = {
  next(state = {}, action) {
    const data = action.payload.reduce((errs, err) => (
      Object.assign(errs, { [err.error]: err })
    ), {});

    return Object.assign({}, ensureStructure(state, action), {
      [action.meta.ref]: {
        data,
        sync: false,
        loading: false,
      },
    });
  },
  throw: handleError,
};


const create = {
  next(state = {}, action) {
    const safeState = ensureStructure(state, action);
    const type = action.meta.ref.split('/', 2)[0].toUpperCase();

    if (action.payload !== `CREATED-${type}`) {
      return handleError(state, action);
    }

    const data = Object.assign({}, safeState[action.meta.ref].data, {
      [action.meta.err.error]: action.meta.err,
    });

    return Object.assign({}, safeState, {
      [action.meta.ref]: {
        data,
        sync: false,
        loading: false,
      },
    });
  },
  throw: handleError,
};


const update = {
  next(state = {}, action) {
    const safeState = ensureStructure(state, action);
    const type = action.meta.ref.split('/', 2)[0].toUpperCase();

    if (action.payload !== `UPDATED-${type}`) {
      return handleError(state, action);
    }

    const data = Object.assign({}, safeState[action.meta.ref].data, {
      [action.meta.err.error]: action.meta.err,
    });

    return Object.assign({}, safeState, {
      [action.meta.ref]: {
        data,
        sync: false,
        loading: false,
      },
    });
  },
  throw: handleError,
};


const remove = {
  next(state = {}, action) {
    const safeState = ensureStructure(state, action);

    const data = Object.assign({}, safeState[action.meta.ref].data);
    delete data[action.meta.err.error];

    return Object.assign({}, safeState, {
      [action.meta.ref]: {
        data,
        sync: false,
        loading: false,
      },
    });
  },
  throw: handleError,
};


export {
  fetch as FETCH,
  create as CREATE,
  update as UPDATE,
  remove as REMOVE,
};
