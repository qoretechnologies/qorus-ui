import { updateItemWithId } from '../../utils';


const initialState = { data: [], sync: false, loading: false };


const setOption = {
  next(state = initialState, action) {
    return Object.assign({}, state, {
      data: updateItemWithId(
        action.meta.modelId,
        action.payload,
        state.data
      ),
    });
  },
  throw(state = initialState, action) {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      error: action.payload,
    });
  },
};


export {
  setOption as SETOPTION,
};
