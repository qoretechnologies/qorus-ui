import { setUpdatedToNull, updateItemWithId } from '../utils';

const processStartedReducer = {
  next (
    state,
    {
      payload: { events },
    }
  ) {
    if (state && state.sync) {
      const data = state.data.slice();
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach(dt => {
        newData = updateItemWithId(
          dt.id,
          { process: dt.info, _updated: true },
          newData
        );
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

const processStoppedReducer = {
  next (
    state,
    {
      payload: { events },
    }
  ) {
    if (state && state.sync) {
      const data = state.data.slice();
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach(dt => {
        newData = updateItemWithId(
          dt.id,
          { process: null, _updated: true },
          newData
        );
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

const basicDataUpdatedReducer = {
  next (
    state,
    {
      payload: { events },
    }
  ) {
    if (state && state.sync) {
      const data = state.data.slice();
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach(dt => {
        newData = updateItemWithId(
          dt.id,
          { ...dt.info, _updated: true },
          newData
        );
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

export {
  processStartedReducer,
  processStoppedReducer,
  basicDataUpdatedReducer,
};
