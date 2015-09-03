import { createStore, applyMiddleware, combineReducers, compose } from 'redux';

function reducer(state = {}, action) {
  console.log('state', state);
  console.log('action', action);
  switch (action.type) {
    case 'INIT':
      return Object.assign({}, state, { 'initialized': true });
  }
}

import thunk from 'redux-thunk';
import promise from 'redux-promise';

const initialState = {}; // or whatever it should be

const finalCreateStore = applyMiddleware(thunk, promise)(createStore);
const store = finalCreateStore(reducer, initialState);
export default store;