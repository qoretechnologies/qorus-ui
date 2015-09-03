import { createStore, applyMiddleware, combineReducers, compose } from 'redux';

let initialState = {
  info: {
    'version': '1.2.3',
    'instance': 'Test 123'
  }
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'INIT':
      return Object.assign({}, state, { 'initialized': true });
    default:
      return state;
  }
}

export const store = createStore(reducer);
