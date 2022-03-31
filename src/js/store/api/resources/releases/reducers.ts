// @flow
const fetchReleases: Object = {
  next(
    state: Object,
    {
      payload: {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'releases' does not exist on type 'Object... Remove this comment to see the full error message
        releases,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'fetchMore' does not exist on type 'Objec... Remove this comment to see the full error message
        fetchMore,
      },
    }: {
      payload: Object;
      releases: Array<Object>;
      fetchMore: boolean;
    }
  ): Object {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = [...state.data];
    const newData = fetchMore ? [...data, ...releases] : releases;

    return { ...state, ...{ data: newData, loading: false, sync: true } };
  },
};

const changeOffset: Object = {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
  next(state: Object, { payload: { newOffset } }: Object): Object {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'offset' does not exist on type 'Object'.
    const offset = newOffset || newOffset === 0 ? newOffset : state.offset + 50;

    return { ...state, ...{ offset } };
  },
};

const changeSort: Object = {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
  next(state: Object, { payload: { newSort } }: Object): Object {
    return { ...state, ...{ sort: newSort } };
  },
};

const changeSortDir: Object = {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
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
