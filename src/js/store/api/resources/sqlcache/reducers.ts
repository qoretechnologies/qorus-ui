const clearCache = {
  next(state: Object = {}, action: Object): Object {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    let data = Object.assign({}, state.data);
    // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
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

export { clearCache as CLEARCACHE };
