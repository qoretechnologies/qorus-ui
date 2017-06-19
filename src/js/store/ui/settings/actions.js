// @flow
import { createAction } from 'redux-actions';

import { ACTIONS } from '../../../constants/settings';

export const saveDimensions: Function = createAction(
  ACTIONS.SETTINGS_SAVEDIMENSIONS,
);
