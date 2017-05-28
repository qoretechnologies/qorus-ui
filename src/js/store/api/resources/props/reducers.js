import { updateProps, deleteProps } from './helper';

const initialState = {
  data: [],
  sync: false,
  loading: false,
};

const defaultReducer = {
  next(state: Object = initialState) {
    return state;
  },
  throw(state: Object = initialState) {
    return state;
  },
};

const manageProp = {
  next(state: Object = initialState, action: Object) {
    const data = { ...state.data };

    return { ...state, ...{ data: updateProps(data, action.payload.prop) } };
  },
  throw(state: Object = initialState) {
    return state;
  },
};

const removePropOptimistic = {
  next(state: Object = initialState, action: Object) {
    return Object.assign({}, state, { data: deleteProps(state.data, action.payload.prop) });
  },
  throw(state: Object = initialState) {
    return state;
  },
};

const removeProp = defaultReducer;

export {
  removePropOptimistic as REMOVEPROPOPTIMISTIC,
  manageProp as MANAGEPROP,
  removeProp as REMOVEPROP,
};
