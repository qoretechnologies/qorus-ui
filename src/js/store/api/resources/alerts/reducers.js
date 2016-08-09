const initialState = { };


const markAllAsRead = {
  next(state = initialState, { payload: { type } }) {
    console.log(type);

    const markNotification = notification => {
      if (!type || type === notification.alerttype) {
        return { _read: true, ...notification };
      }
      return notification;
    }
    return { ...state, ...{ data: state.data.map(markNotification) } };
  },
  throw(state = initialState) {
    console.log('error');
    return state;
  },
};

export {
  markAllAsRead as MARKALLASREAD,
};
