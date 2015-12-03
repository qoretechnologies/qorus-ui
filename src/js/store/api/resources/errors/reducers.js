function ensureStructure(state = {}, action) {
  if (state[action.meta.ref]) return state;

  return Object.assign({}, state, {
    [action.meta.ref]: {
      data: {},
      sync: false,
      loading: false
    }
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
        loading: false
      }
    });
  },
  throw(state = {}, action) {
    return Object.assign({}, state, {
      [action.meta.ref]: Object.assign({}, state[action.meta.ref], {
        sync: false,
        loading: false,
        error: action.payload
      })
    });
  }
};


export { fetch as FETCH };
