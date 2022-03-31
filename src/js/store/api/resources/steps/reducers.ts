const initialState = {
  data: {},
  sync: false,
  loading: false,
};

function handleError(state = initialState, action) {
  return Object.assign({}, state, {
    data: Object.assign({}, state.data, {
      [action.meta.id]: null,
    }),
    sync: false,
    loading: false,
    error: action.payload,
  });
}

const fetch = {
  next(state = initialState, action) {
    return Object.assign({}, state, {
      data: Object.assign({}, state.data, {
        [action.meta.id]: action.payload,
      }),
      sync: true,
      loading: false,
    });
  },
  throw: handleError,
};

export { fetch as FETCH };
