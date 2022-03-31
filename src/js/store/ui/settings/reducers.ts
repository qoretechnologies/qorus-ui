// @flow
import { handleActions } from 'redux-actions';
import { ACTIONS } from '../../../constants/settings';

const initialState: Object = {
  width: null,
  height: null,
  tablet: false,
};

export default handleActions(
  {
    [ACTIONS.SETTINGS_SAVEDIMENSIONS]: (state: Object, { payload: { width, height } }) => ({
      ...state,
      ...{ width, height, tablet: width < 1400 },
    }),
    [ACTIONS.MAXIMIZE]: (state: Object) => ({
      ...state,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'isMaximized' does not exist on type 'Obj... Remove this comment to see the full error message
      ...{ isMaximized: !state.isMaximized },
    }),
  },
  initialState
);
