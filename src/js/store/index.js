import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import menusInitialState from './menu'

function reducer(state = {}, action) {
  console.log('state', state)
  console.log('action', action)
  switch (action.type) {
    case 'INIT':
      return Object.assign({}, state, { 'initialized': true })
  }
}

import thunk from 'redux-thunk'
import promise from 'redux-promise'

const initialState = {}

const finalCreateStore = applyMiddleware(thunk, promise)(createStore)
const store = finalCreateStore(reducer, initialState)
export default store
