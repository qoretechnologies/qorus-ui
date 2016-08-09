const initialState = { };


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

export {
  markAllAsRead as MARKALLASREAD,
};
