import {
  setUpdatedToNull,
  updateItemWithId,
  updateItemWithName,
} from '../utils';
import { formatAppender } from '../../../helpers/logger';
import isArray from 'lodash/isArray';

const updateConfigItemWsCommon = {
  next (
    state,
    {
      payload: { events },
    }
  ) {
    let newState = { ...state };
    let newData = newState.data;

    events.forEach((dt: Object) => {
      if (dt.id) {
        newData = [...newData];

        const intrf: Object = newData.find(
          (datum: Object): boolean => datum.id === dt.id
        );

        if (intrf) {
          const { config } = intrf;

          if (dt.stepid) {
            const step: Object = intrf.stepinfo.find(
              (stp: Object) => stp.stepid === dt.stepid
            );

            step.config[dt.item].value = dt.value;
            step.config[dt.item].actual_value = dt.actual_value;
            step.config[dt.item].override = dt.override;
          } else {
            config[dt.item].value = dt.value;
            config[dt.item].actual_value = dt.actual_value;
            config[dt.item].override = dt.override;
          }

          newData = updateItemWithId(dt.id, { _updated: true }, newData);
          newState = { ...newState, ...{ data: newData } };
        }
      } else {
        const globalConfig = updateItemWithName(
          dt.item,
          {
            value: dt.value,
          },
          newState.globalConfig,
          'name'
        );

        newState.globalConfig = globalConfig;
        newState = { ...newState };
      }
    });

    return newState;
  },
};

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
    const isSystem = !isArray(state.data);

    const flattenedAppenders =
      logger &&
      appenders.reduce(
        (cur: Array<Object>, appender: Object) => [
          ...cur,
          formatAppender(appender),
        ],
        []
      );

    data = updateItemWithId(
      id,
      {
        isUsingDefaultLogger: logger.interface_table_name,
        loggerData: {
          logger: empty ? 'empty' : logger.params,
          appenders: flattenedAppenders,
        },
      },
      isSystem ? [...state.logs] : [...state.data]
    );

    if (isSystem) {
      return { ...state, ...{ logs: data } };
    }

    return { ...state, ...{ data } };
  },
};

const defaultLoggerReducer = {
  next (
    state,
    {
      payload: { logger, appenders, intfc, empty },
    }
  ) {
    let data = { ...state.data };

    if (logger) {
      const flattenedAppenders = appenders.reduce(
        (cur: Array<Object>, appender: Object) => [
          ...cur,
          formatAppender(appender),
        ],
        []
      );

      data = {
        ...state.data,
        defaultLoggers: {
          [intfc]: {
            logger: logger.params,
            appenders: flattenedAppenders,
            isDefault: true,
          },
          ...state.data.defaultLoggers,
        },
      };
    } else {
      data = {
        ...state.data,
        defaultLoggers: {
          [intfc]: {
            logger: 'empty',
          },
          ...state.data.defaultLoggers,
        },
      };
    }

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
      const isSystem = !isArray(state.data);
      let newData;

      // If this is not a system log
      // Get the interface data
      if (!isSystem) {
        newData = [...state.data];
        newData = setUpdatedToNull(newData);
      } else {
        // Otherwise get the logs data
        newData = [...state.logs];
      }

      events.forEach(dt => {
        let itemUpdate;

        if (dt.isNew) {
          itemUpdate = {
            isUsingDefaultLogger: false,
            loggerData: {
              logger: dt.params,
              appenders: [],
            },
            _updated: true,
          };
        } else {
          // Get the current items loggerData
          const { loggerData } = newData.find(
            item => item.id === dt.interfaceid
          );

          itemUpdate = {
            isUsingDefaultLogger: false,
            loggerData: {
              logger: dt.params,
              appenders: loggerData.appenders,
            },
            _updated: true,
          };
        }

        newData = updateItemWithId(dt.interfaceid, itemUpdate, newData);
      });

      if (isSystem) {
        return { ...state, ...{ logs: newData } };
      }

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
        if (!isNotSystem) {
          newData = {
            ...newData,
            loggerData: {
              [dt.interface]: {
                ...dt.current_logger.params,
                isDefault: dt.current_logger.interface_table_name === 'system',
                appenders: dt.appenders,
              },
            },
          };
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

        let appenders: Array<Object> = dt.interfaceid
          ? intfc?.appenders || []
          : newData.loggerData?.[dt.interface]?.appenders || [];
        appenders = [...appenders, formatAppender(dt)];

        if (dt.interfaceid) {
          newData = updateItemWithId(
            dt.interfaceid,
            { appenders, _updated: true },
            newData
          );
        } else {
          let loggerData = newData.loggerData;

          loggerData[dt.interface].appenders = appenders;

          newData = { ...newData, loggerData };
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

        const appendersArr: string = dt.interfaceid
          ? intfc.appenders
          : intfc.loggerData[dt.interface].appenders;
        const appenders: Array<Object> = appendersArr.filter(
          (appender: Object) => appender.id !== dt.logger_appenderid
        );

        if (dt.interfaceid) {
          newData = updateItemWithId(
            dt.interfaceid,
            { appenders, _updated: true },
            newData
          );
        } else {
          let loggerData = newData.loggerData;

          loggerData[dt.interface].appenders = appenders;

          newData = { ...newData, loggerData };
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
  updateConfigItemWsCommon,
  defaultLoggerReducer,
};
