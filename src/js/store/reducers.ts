// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module 'redux' or its corresponding ty... Remove this comment to see the full error message
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import api from './api';
import ui from './ui';
import ws from './websockets';
import log from './log';

export default combineReducers({
  api,
  ui,
  ws,
  log,
  form: formReducer,
});
