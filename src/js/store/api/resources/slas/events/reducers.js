const fetchEvents: Object = {
  next(
    state: Object,
    { payload: {
      events,
      fetchMore,
    } }: {
        payload: Object,
        events: Array<Object>,
        fetchMore: boolean,
      }
  ): Object {
    const data = [...state.data];
    const newData = fetchMore ? [...data, ...events] : events;

    return { ...state, ...{ data: newData, loading: false, sync: true } };
  },
};

const changeOffset: Object = {
  next(state: Object = {}, { payload: { newOffset } }: Object): Object {
    const offset = newOffset || newOffset === 0 ? newOffset : state.offset + 50;

    return { ...state, ...{ offset } };
  },
};

const changeServerSort: Object = {
  next(state: Object = {}, { payload: { sort } }: Object): Object {
    const sortDir = state.sort === sort ? !state.sortDir : state.sortDir;

    return { ...state, ...{ offset: 0, sort, sortDir } };
  },
};

const unsync: Object = {
  next(): Object {
    return {
      data: [],
      sync: false,
      loading: false,
      offset: 0,
      limit: 50,
      sort: 'sla_eventid',
      sortDir: true,
    };
  },
};

export {
  fetchEvents as FETCHEVENTS,
  changeOffset as CHANGEOFFSET,
  changeServerSort as CHANGESERVERSORT,
  unsync as UNSYNC,
};
