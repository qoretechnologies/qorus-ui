const fetchPerf: any = {
  next(
    state: any,
    {
      payload: {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'perf' does not exist on type 'Object'.
        perf,
      },
    }: {
      payload: any;
      perf: Array<Object>;
    }
  ): any {
    return { ...state, ...{ data: perf, loading: false, sync: true } };
  },
};

export { fetchPerf as FETCHPERFDATA };
