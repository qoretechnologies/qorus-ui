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

const loggerReducer = {
  next (
    state,
    {
      payload: { logger, appenders, id },
    }
  ) {
    if (logger) {
      const flattenedAppenders = appenders.reduce(
        (cur: Array<Object>, appender: Object) => [
          ...cur,
          {
            id: appender.id,
            type: appender.params.appenderType,
            layoutPattern: appender.params.layoutPattern,
            name: appender.params.name,
            rotationCount: appender.params.rotationCount,
          },
        ],
        []
      );

      const data = updateItemWithId(
        id,
        {
          logger: {
            ...logger.params,
            isDefault: !!logger.interface_table_name,
          },
          appenders: flattenedAppenders,
        },
        [...state.data]
      );

      return { ...state, ...{ data } };
    }

    return state;
  },
};

const addUpdateLoggerReducer = {
  next (
    state,
    {
      payload: { events },
    }
  ) {
    if (state && state.sync) {
      const data = [...state.data];
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach(dt => {
        let itemUpdate: Object = { logger: dt.params, _updated: true };

        if (dt.isNew) {
          itemUpdate = { ...itemUpdate, appenders: [] };
        }

        newData = updateItemWithId(dt.interfaceid, itemUpdate, newData);
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

const deleteLoggerReducer = {
  next (
    state,
    {
      payload: { events },
    }
  ) {
    if (state && state.sync) {
      const data = [...state.data];
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach(dt => {
        newData = updateItemWithId(
          dt.interfaceid,
          {
            logger: {
              ...dt.current_logger.params,
              isDefault: !!dt.current_logger.interface_table_name,
            },
            appenders: dt.appenders,
            _updated: true,
          },
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
  loggerReducer,
  addUpdateLoggerReducer,
  deleteLoggerReducer,
};
