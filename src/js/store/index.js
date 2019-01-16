import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

import reducers from './reducers';
import middlewares from '../middlewares';

const configureStore: Function = () => {
  const store = createStore(
    reducers,
    applyMiddleware(thunk, promise, ...middlewares)
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};

export default configureStore();
