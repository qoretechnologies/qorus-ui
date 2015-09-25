import { combineReducers } from 'redux';
import menu from './menu';
import workflowsReducer from './workflows';
import systemReducer from './system';
import currentUserReducer from './current-user';

export default combineReducers({
  menu: menu,
  api: combineReducers({
    workflows: workflowsReducer,
    system: systemReducer,
    currentUser: currentUserReducer
  })
});
