const unsync = {
  next(): Object {
    console.log('kek');
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
