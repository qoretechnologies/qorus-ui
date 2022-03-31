const fetchPerf: Object = {
  next(
    state: Object,
    {
      payload: {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'perf' does not exist on type 'Object'.
        perf,
      },
    }: {
      payload: Object;
      perf: Array<Object>;
    }
  ): Object {
    return { ...state, ...{ data: perf, loading: false, sync: true } };
  },
};

export { fetchPerf as FETCHPERFDATA };
