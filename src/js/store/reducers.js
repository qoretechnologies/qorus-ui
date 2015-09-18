import { combineReducers } from 'redux';
import menu from './menu';
import workflowsReducer from './workflows';

export default combineReducers({
  menu: menu,
  api: workflowsReducer
});
