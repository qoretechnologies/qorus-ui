const fetchPerf: Object = {
  next(
    state: Object,
    { payload: {
      perf,
    } }: {
        payload: Object,
        perf: Array<Object>,
      }
  ): Object {
    return { ...state, ...{ data: perf, loading: false, sync: true } };
  },
};

export {
  fetchPerf as FETCHPERFDATA,
};
