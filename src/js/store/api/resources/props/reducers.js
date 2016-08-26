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

const addPropOptimistic = {
  next(state: Object = initialState, action: Object) {
    return Object.assign({}, state, { data: updateProps(state.data, action.payload.prop) });
  },
  throw(state: Object = initialState) {
    return state;
  },
};

const updatePropOptimistic = {
  next(state: Object = initialState, action: Object) {
    return Object.assign({}, state, { data: updateProps(state.data, action.payload.prop) });
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

const addProp = defaultReducer;
const updateProp = defaultReducer;
const removeProp = defaultReducer;

export {
  addPropOptimistic as ADDPROPOPTIMISTIC,
  updatePropOptimistic as UPDATEPROPOPTIMISTIC,
  removePropOptimistic as REMOVEPROPOPTIMISTIC,
  addProp as ADDPROP,
  updateProp as UPDATEPROP,
  removeProp as REMOVEPROP,
};
