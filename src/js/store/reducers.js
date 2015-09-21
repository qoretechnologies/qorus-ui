import { combineReducers } from 'redux';
import menu from './menu';
import workflowsReducer from './workflows';
import systemReducer from './system';

export default combineReducers({
  menu: menu,
  api: combineReducers({
    workflows: workflowsReducer,
    system: systemReducer
  })
});
