import { updateProps, deleteProps } from './helper';

const initialState = {
  data: [],
  sync: false,
  loading: false,
};

const manageProp = {
  next(
    state: Object = initialState,
    {
      payload: { prop },
    }
  ) {
    if (prop.domain === 'omq') return state;

    const data = { ...state.data };

    return { ...state, ...{ data: updateProps(data, prop) } };
  },
  throw(state: Object = initialState) {
    return state;
  },
};

const removeProp = {
  next(state: Object = initialState, action: Object) {
    return Object.assign({}, state, {
      data: deleteProps(state.data, action.payload.prop),
    });
  },
  throw(state: Object = initialState) {
    return state;
  },
};

export { manageProp as MANAGEPROP, removeProp as REMOVEPROP };
