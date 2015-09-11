import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import reducers from './reducers';

const middleware = [thunk, promise];

const finalCreateStore = compose(
  applyMiddleware(...middleware),
  require('redux-devtools').devTools(),
  require('redux-devtools').persistState(
    window.location.href.match(/[?&]debug_session=([^&]+)\b/)
  ),
  createStore
);

const store = finalCreateStore(reducers);

export default store;
