import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import menu from './menu';
import api from './api';
import ui from './ui';

export default combineReducers({
  menu,
  api,
  ui,
  form: formReducer,
});
