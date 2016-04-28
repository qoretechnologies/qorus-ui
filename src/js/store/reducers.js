import { combineReducers } from 'redux';
import menu from './menu';
import api from './api';
import ui from './ui';

export default combineReducers({
  menu,
  api,
  ui,
});
