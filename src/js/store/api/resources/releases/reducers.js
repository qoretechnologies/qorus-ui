// @flow
const fetchReleases: Object = {
  next(
    state: Object,
    { payload: {
      releases,
      fetchMore,
    } } : {
      payload: Object,
      releases: Array<Object>,
      fetchMore: boolean,
    }
  ): Object {
    const data = [...state.data];
    const newData = fetchMore ? [...data, ...releases] : releases;

    return { ...state, ...{ data: newData, loading: false, sync: true } };
  },
};

const changeOffset: Object = {
  next(state: Object, { payload: { newOffset } }: Object): Object {
    const offset = newOffset || newOffset === 0 ? newOffset : state.offset + 50;

    return { ...state, ...{ offset } };
  },
};

const changeSort: Object = {
  next(state: Object, { payload: { newSort } }: Object): Object {
    return { ...state, ...{ sort: newSort } };
  },
};

const changeSortDir: Object = {
  next(state: Object, { payload: { newSortDir } }: Object): Object {
    return { ...state, ...{ sortDir: newSortDir } };
  },
};

const unsync = {
  next() {
    return {
      data: [],
      sync: false,
      loading: false,
      offset: 0,
      limit: 50,
      sort: 'Name',
      sortDir: 'Descending',
    };
  },
};

export {
  fetchReleases as FETCHRELEASES,
  changeOffset as CHANGEOFFSET,
  changeSort as CHANGESORT,
  changeSortDir as CHANGESORTDIR,
  unsync as UNSYNC,
};
