import { createStore, applyMiddleware, combineReducers, compose } from 'redux';

function reducer(state = {}, action) {
  switch (action.type) {
    case 'INIT':
      return Object.assign({}, state, { 'initialized': true });
  }
}

export const store = createStore(reducer);
