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

            step.config[dt.name].value = dt.value;
            step.config[dt.name].level = dt.level;
            step.config[dt.name].is_set = dt.is_set;
            step.config[dt.name].currentType = dt.currentType;
            step.config[dt.name].is_templated_string = dt.is_templated_string;
          } else {
            config[dt.name].value = dt.value;
            config[dt.name].level = dt.level;
            config[dt.name].currentType = dt.currentType;
            config[dt.name].is_set = dt.is_set;
            config[dt.name].is_templated_string = dt.is_templated_string;
          }

          newData = updateItemWithId(dt.id, { _updated: true }, newData);
          newState = { ...newState, ...{ data: newData } };
        }
      } else {
        const globalConfig = updateItemWithName(
          dt.name,
          {
            value: dt.value,
            is_set: dt.is_set,
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
    let editedData;
    const isSystem = !isArray(state.data);

    // Check if this interface is using a default logger
    // or any logger
    if (empty || logger.isDefault) {
      editedData = {
        isUsingDefaultLogger: true,
      };
    } else {
      const flattenedAppenders = appenders.reduce(
        (cur: Array<Object>, appender: Object) => [
          ...cur,
          formatAppender(appender),
        ],
        []
      );

      editedData = {
        isUsingDefaultLogger: false,
        loggerData: {
          logger: logger.params,
          appenders: flattenedAppenders,
        },
      };
    }

    data = updateItemWithId(
      id,
      editedData,
      isSystem ? [...state.logs] : [...state.data]
    );

    if (isSystem) {
      return { ...state, ...{ logs: data } };
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
          const { loggerData } = newData.find(item => item.id === dt.id);

          itemUpdate = {
            isUsingDefaultLogger: false,
            loggerData: {
              logger: dt.params,
              appenders: loggerData.appenders,
            },
            _updated: true,
          };
        }

        newData = updateItemWithId(dt.id, itemUpdate, newData);
      });

      if (isSystem) {
        return { ...state, ...{ logs: newData } };
      }

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

// Deleting CONCRETE logger
const deleteLoggerReducer = {
  next (
    state,
    {
      payload: { events },
    }
  ) {
    if (state && state.sync) {
      // If this is under system
      const isSystem = !isArray(state.data);
      let newData;
      // If we are updating system or interface
      // logger
      if (!isSystem) {
        newData = [...state.data];
        newData = setUpdatedToNull(newData);
      } else {
        newData = [...state.logs];
      }
      // Loop through the events
      events.forEach(dt => {
        newData = updateItemWithId(
          dt.id,
          {
            // This interface is automatically using default logger
            // We don't care if there isn't one
            isUsingDefaultLogger: true,
            loggerData: null,
          },
          newData
        );
      });
      // Update system
      if (isSystem) {
        return { ...state, ...{ logs: newData } };
      }
      // Update interface
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
      const isSystem = !isArray(state.data);
      let newData;

      if (!isSystem) {
        newData = [...state.data];
        newData = setUpdatedToNull(newData);
      } else {
        newData = [...state.logs];
      }
      // Go through the events
      events.forEach(dt => {
        // Get the interface loggerData
        const { loggerData } = newData.find(
          (datum: Object) => datum.id === dt.id
        );
        // Add the new appender to the loggerData
        loggerData.appenders.push(formatAppender(dt));
        // Update the data
        newData = updateItemWithId(dt.id, { loggerData }, newData);
      });

      if (isSystem) {
        return { ...state, ...{ logs: newData } };
      }

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

const editAppenderReducer = {
  next (
    state,
    {
      payload: { events },
    }
  ) {
    if (state && state.sync) {
      const isSystem = !isArray(state.data);
      let newData;

      if (!isSystem) {
        newData = [...state.data];
        newData = setUpdatedToNull(newData);
      } else {
        newData = [...state.logs];
      }
      // Go through the events
      events.forEach(dt => {
        // Get the interface loggerData
        const { loggerData } = newData.find(
          (datum: Object) => datum.id === dt.id
        );
        // Add the new appender to the loggerData
        loggerData.appenders = loggerData.appenders.map(appender => {
          if (appender.id === dt.logger_appenderid) {
            return formatAppender(dt);
          }

          return appender;
        });

        // Update the data
        newData = updateItemWithId(dt.id, { loggerData }, newData);
      });

      if (isSystem) {
        return { ...state, ...{ logs: newData } };
      }

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
      const isSystem = !isArray(state.data);
      let newData;

      if (!isSystem) {
        newData = [...state.data];
        newData = setUpdatedToNull(newData);
      } else {
        newData = [...state.logs];
      }

      events.forEach(dt => {
        // Get the interface loggerData
        const { loggerData } = newData.find(
          (datum: Object) => datum.id === dt.id
        );
        // Remove the appender
        loggerData.appenders = loggerData.appenders.filter(
          appender => appender.id !== dt.logger_appenderid
        );
        // Update the data
        newData = updateItemWithId(dt.interfaceid, { loggerData }, newData);
      });

      if (isSystem) {
        return { ...state, ...{ logs: newData } };
      }

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
  editAppenderReducer,
  deleteAppenderReducer,
  updateConfigItemWsCommon,
};
