const fetchEvents: any = {
  next(
    state: any,
    {
      payload: {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'events' does not exist on type 'Object'.
        events,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'fetchMore' does not exist on type 'Objec... Remove this comment to see the full error message
        fetchMore,
      },
    }: {
      payload: any;
      events: Array<Object>;
      fetchMore: boolean;
    }
  ): any {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = [...state.data];
    const newData = fetchMore ? [...data, ...events] : events;

    return { ...state, ...{ data: newData, loading: false, sync: true } };
  },
};

const changeOffset: any = {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
  next(state: any = {}, { payload: { newOffset } }: any): any {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'offset' does not exist on type 'Object'.
    const offset = newOffset || newOffset === 0 ? newOffset : state.offset + 50;

    return { ...state, ...{ offset } };
  },
};

const changeServerSort: any = {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
  next(state: any = {}, { payload: { sort } }: any): any {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'sort' does not exist on type 'Object'.
    const sortDir = state.sort === sort ? !state.sortDir : state.sortDir;

    return { ...state, ...{ offset: 0, sort, sortDir } };
  },
};

const unsync: any = {
  next(): any {
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
