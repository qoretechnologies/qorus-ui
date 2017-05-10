import { updateItemWithName } from '../../utils';

const initialState = { data: [], sync: false, loading: false };

const setOption = {
  next(state = initialState, { payload: { option, value } }) {
    return Object.assign({}, state, {
      data: updateItemWithName(
        option,
        { value },
        state.data
      ),
    });
  },
};


export {
  setOption as SETOPTION,
};
