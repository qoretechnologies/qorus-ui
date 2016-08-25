const loadExtensionData = {
  next(state, action) {
    const { payload, meta: { name  } } = action;
    const extension = state.data.find(item => item.name === name);
    extension.data = payload;

    return {
      ...state,
      data: state.data.map(item => {
        if (item.name === extension.name) {
          return extension;
        }
        return item;
      }),
    };
  },
  throw(state) { return state; },
};

export {
  loadExtensionData as LOADEXTENSIONDATA,
};