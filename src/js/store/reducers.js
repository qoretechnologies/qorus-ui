import { combineReducers } from 'redux';
import menu from './menu';
import apiReducers from './api';

export default combineReducers({
  menu,
  api: apiReducers
});
