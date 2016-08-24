const clearCache = {
  next(state: Object = {}, action: Object): Object {
    let data = Object.assign({}, state.data);
    const { datasource, name } = action.payload;

    if (name) {
      delete data[datasource].tables[name];
    } else if (datasource) {
      delete data[datasource];
    } else {
      data = {};
    }

    return Object.assign({}, state, { data });
  },
  throw(state: Object = {}): Object {
    return state;
  },
};

export {
  clearCache as CLEARCACHE,
};
