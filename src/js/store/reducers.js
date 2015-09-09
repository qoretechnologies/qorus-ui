import { combineReducers } from 'redux';
import menu from './menu';
import { restReducers } from '../lib/qorus-api';

export default combineReducers({
  workflows: restReducers,
  menu: menu
});
