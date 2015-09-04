import { combineReducers } from 'redux';
import menu from './menu';
import workflows from './workflows';

function reducer(state = {}, action) {
  console.log('state', state);
  console.log('action', action);
  switch (action.type) {
    case 'INIT':
      return Object.assign({}, state, { 'initialized': true });
  }

  return state;
}


export default combineReducers({
  reducer,
  menu,
  workflows
});
