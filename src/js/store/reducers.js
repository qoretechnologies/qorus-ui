import { combineReducers } from 'redux';
import menu from './menu';
import api from './api';

export default combineReducers({
  menu,
  api
});
