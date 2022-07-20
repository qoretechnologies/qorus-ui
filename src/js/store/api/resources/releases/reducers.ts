// @flow
const fetchReleases: any = {
  next(
    state: any,
    {
      payload: {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'releases' does not exist on type 'Object... Remove this comment to see the full error message
        releases,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'fetchMore' does not exist on type 'Objec... Remove this comment to see the full error message
        fetchMore,
      },
    }: {
      payload: any;
      releases: Array<Object>;
      fetchMore: boolean;
    }
  ): any {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = [...state.data];
    const newData = fetchMore ? [...data, ...releases] : releases;

    return { ...state, ...{ data: newData, loading: false, sync: true } };
  },
};

const changeOffset: any = {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
  next(state: any, { payload: { newOffset } }: any): any {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'offset' does not exist on type 'Object'.
    const offset = newOffset || newOffset === 0 ? newOffset : state.offset + 50;

    return { ...state, ...{ offset } };
  },
};

const changeSort: any = {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
  next(state: any, { payload: { newSort } }: any): any {
    return { ...state, ...{ sort: newSort } };
  },
};

const changeSortDir: any = {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
  next(state: any, { payload: { newSortDir } }: any): any {
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
