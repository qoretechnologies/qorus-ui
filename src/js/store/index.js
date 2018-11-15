import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

import reducers from './reducers';
import middlewares from '../middlewares';

export default createStore(
  reducers,
  applyMiddleware(thunk, promise, ...middlewares)
);
