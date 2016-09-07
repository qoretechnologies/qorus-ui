import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import menu from './menu';
import api from './api';
import ui from './ui';
import ws from './websockets';
import log from './log';

export default combineReducers({
  menu,
  api,
  ui,
  ws,
  log,
  form: formReducer,
});
