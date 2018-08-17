import remove from 'lodash/remove';

import { setUpdatedToNull, updateItemWithId } from '../../utils';

const initialState = {};

const markAllAsRead = {
  next(
    state = initialState,
    {
      payload: { type },
    }
  ) {
    const markNotification = notification => {
      if (!type || type === notification.alerttype) {
        return { _read: true, ...notification };
      }
      return notification;
    };
    return {
      ...state,
      ...{ data: state.data.map(markNotification) },
    };
  },
  throw(state = initialState) {
    return state;
  },
};

const alertRaised = {
  next(
    state = initialState,
    {
      payload: { events },
    }
  ) {
    if (state.sync) {
      const stateData = state.data.slice();
      const updatedData = setUpdatedToNull(stateData);
      let newData = updatedData;

      events.forEach(dt => {
        const findAlert = newData.findIndex(
          alert => alert.type === dt.type && alert.id === dt.alertid
        );

        // Alert exists, update it instead
        if (findAlert >= 0) {
          const updatedItem = Object.assign({}, dt[findAlert], {
            ...dt,
            ...{ _updated: true, alerttype: dt.alerttype },
          });

          newData = stateData
            .slice(0, findAlert)
            .concat([updatedItem])
            .concat(newData.slice(findAlert + 1));
        } else {
          const alert = {
            ...dt,
            ...{ alerttype: dt.alerttype, _updated: true },
          };

          newData = [...newData, alert];
        }
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw(state = initialState) {
    return state;
  },
};

const alertCleared = {
  next(
    state = initialState,
    {
      payload: { events },
    }
  ) {
    if (state.sync) {
      const data = [...state.data];
      const updatedData = setUpdatedToNull(data);

      events.forEach(({ id }) => {
        remove(updatedData, alert => alert.alertid === id);
      });

      return { ...state, ...{ data: updatedData } };
    }

    return state;
  },
  throw(state = initialState) {
    return state;
  },
};

const updateDone = {
  next(
    state,
    {
      payload: { id },
    }
  ) {
    if (state.sync) {
      const data = state.data.slice();
      const alert = data.find(d => d.alertid === id);

      if (alert) {
        const newData = updateItemWithId(
          id,
          { _updated: null },
          data,
          'alertid'
        );

        return { ...state, ...{ data: newData } };
      }
    }

    return state;
  },
  throw(state, action) {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      error: action.payload,
    });
  },
};

export {
  markAllAsRead as MARKALLASREAD,
  alertRaised as RAISED,
  alertCleared as CLEARED,
  updateDone as UPDATEDONE,
};
