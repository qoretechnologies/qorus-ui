import { setUpdatedToNull, updateItemWithId } from '../utils';
import { formatAppender } from '../../../helpers/logger';
import isArray from 'lodash/isArray';

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
      payload: { logger, appenders, id, empty },
    }
  ) {
    let data;

    if (logger) {
      const flattenedAppenders = appenders.reduce(
        (cur: Array<Object>, appender: Object) => [
          ...cur,
          formatAppender(appender),
        ],
        []
      );

      if (!id) {
        data = {
          ...state.data,
          loggerData: {
            ...logger.params,
            isDefault: false,
          },
          appenders: flattenedAppenders,
        };
      } else {
        data = updateItemWithId(
          id,
          {
            loggerData: {
              ...logger.params,
              isDefault: !!logger.interface_table_name,
            },
            appenders: flattenedAppenders,
          },
          [...state.data]
        );
      }

      return { ...state, ...{ data } };
    }

    data = {
      ...state.data,
      loggerData: 'empty',
    };

    return { ...state, ...{ data } };
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
      // Check if this is system or interfaces
      const isNotSystem = isArray(state.data);
      let newData;

      if (isNotSystem) {
        newData = [...state.data];
        newData = setUpdatedToNull(newData);
      } else {
        newData = { ...state.data };
      }

      events.forEach(dt => {
        let itemUpdate: Object = { loggerData: dt.params, _updated: true };

        if (dt.isNew) {
          itemUpdate = { ...itemUpdate, appenders: [] };
        }

        if (dt.interfaceid) {
          newData = updateItemWithId(dt.interfaceid, itemUpdate, newData);
        } else {
          newData = { ...newData, ...itemUpdate };
        }
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
      const isNotSystem = isArray(state.data);
      let newData;

      if (isNotSystem) {
        newData = [...state.data];
        newData = setUpdatedToNull(newData);
      } else {
        newData = { ...state.data };
      }

      events.forEach(dt => {
        //* Default logger was deleted
        if (!dt) {
          newData = { ...newData, loggerData: 'empty' };
        } else {
          newData = updateItemWithId(
            dt.interfaceid,
            {
              loggerData: {
                ...dt.current_logger.params,
                isDefault: !!dt.current_logger.interface_table_name,
              },
              appenders: dt.appenders,
              _updated: true,
            },
            newData
          );
        }
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

const addAppenderReducer = {
  next (
    state,
    {
      payload: { events },
    }
  ) {
    if (state && state.sync) {
      const isNotSystem = isArray(state.data);
      let newData;

      if (isNotSystem) {
        newData = [...state.data];
        newData = setUpdatedToNull(newData);
      } else {
        newData = { ...state.data };
      }

      events.forEach(dt => {
        let intfc;

        if (dt.interfaceid) {
          intfc = newData.find((datum: Object) => datum.id === dt.interfaceid);
        } else {
          intfc = newData;
        }

        let appenders: Array<Object> = intfc?.appenders || [];
        appenders = [...appenders, formatAppender(dt)];

        if (dt.interfaceid) {
          newData = updateItemWithId(
            dt.interfaceid,
            { appenders, _updated: true },
            newData
          );
        } else {
          newData = { ...newData, appenders };
        }
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

const deleteAppenderReducer = {
  next (
    state,
    {
      payload: { events },
    }
  ) {
    if (state && state.sync) {
      const isNotSystem = isArray(state.data);
      let newData;

      if (isNotSystem) {
        newData = [...state.data];
        newData = setUpdatedToNull(newData);
      } else {
        newData = { ...state.data };
      }

      events.forEach(dt => {
        let intfc;

        if (dt.interfaceid) {
          intfc = newData.find((datum: Object) => datum.id === dt.interfaceid);
        } else {
          intfc = newData;
        }

        const appenders: Array<Object> = intfc.appenders.filter(
          (appender: Object) => appender.id !== dt.logger_appenderid
        );

        if (dt.interfaceid) {
          newData = updateItemWithId(
            dt.interfaceid,
            { appenders, _updated: true },
            newData
          );
        } else {
          newData = { ...newData, appenders };
        }
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
  addAppenderReducer,
  deleteAppenderReducer,
};
