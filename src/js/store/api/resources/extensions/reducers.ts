const unsync = {
  next(): any {
    return {
      data: [],
      sync: false,
      loading: false,
    };
  },
};

export { unsync as UNSYNC };
