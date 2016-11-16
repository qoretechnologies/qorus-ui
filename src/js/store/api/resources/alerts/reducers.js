import remove from 'lodash/remove';
import { setUpdatedToNull, updateItemWithId } from '../../utils';

const initialState = {};

const markAllAsRead = {
  next(state = initialState, { payload: { type } }) {
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
  next(state = initialState, { payload: { data, type } }) {
    if (state.sync) {
      const stateData = state.data.slice();
      const findAlert = stateData.findIndex((alert) => (
        alert.type === data.type && alert.id === data.id
      ));

      let newData;

      // Alert exists, update it instead
      if (findAlert >= 0) {
        const updatedItem = Object.assign({}, data[findAlert], {
          ...data,
          ...{ _updated: true, alerttype: type },
        });

        newData = stateData.slice(0, findAlert)
          .concat([updatedItem])
          .concat(stateData.slice(findAlert + 1));
      } else {
        const alert = {...data, ...{alerttype: type, _updated: true}};
        const updatedData = setUpdatedToNull(stateData);

        newData = [...updatedData, alert];
      }

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw(state = initialState) {
    return state;
  },
};

const alertCleared = {
  next(state = initialState, { payload: { id } }) {
    if (state.sync) {
      const data = state.data.slice();

      remove(data, alert => (
        alert.alertid === id
      ));

      return { ...state, ...{ data } };
    }

    return state;
  },
  throw(state = initialState) {
    return state;
  },
};

const updateDone = {
  next(state, { payload: { id } }) {
    if (state.sync) {
      const data = state.data.slice();
      const alert = data.find(d => d.alertid === id);

      if (alert) {
        const newData = updateItemWithId(id, { _updated: null }, data, 'alertid');

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
