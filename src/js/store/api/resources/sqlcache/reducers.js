const clearCache = {
  next(state: Object = {}, action: Object): Object {
    return Object.assign({}, state, { data: action.payload });
  },
  throw(state: Object = {}): Object {
    return state;
  },
};

export {
  clearCache as CLEARCACHE,
};
