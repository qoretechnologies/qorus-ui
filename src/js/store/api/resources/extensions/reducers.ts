const unsync = {
  next(): Object {
    return {
      data: [],
      sync: false,
      loading: false,
    };
  },
};

export {
  unsync as UNSYNC,
};
