import { deleteProps, updateProps } from './helper';

const initialState = {
  data: [],
  sync: false,
  loading: false,
};

const manageProp = {
  next(state: Object = initialState, { payload: { prop } }) {
    if (prop.domain === 'omq') return state;

    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
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
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      data: deleteProps(state.data, action.payload.prop),
    });
  },
  throw(state: Object = initialState) {
    return state;
  },
};

export { manageProp as MANAGEPROP, removeProp as REMOVEPROP };
