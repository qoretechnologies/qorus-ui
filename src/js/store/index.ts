// @ts-ignore ts-migrate(2307) FIXME: Cannot find module 'redux' or its corresponding ty... Remove this comment to see the full error message
import { applyMiddleware, createStore } from 'redux';
import promise from 'redux-promise';
import thunk from 'redux-thunk';
import middlewares from '../middlewares';
import reducers from './reducers';

const configureStore: Function = () => {
  const store = createStore(reducers, applyMiddleware(thunk, promise, ...middlewares));

  // @ts-ignore ts-migrate(2339) FIXME: Property 'hot' does not exist on type 'NodeModule'... Remove this comment to see the full error message
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    // @ts-ignore ts-migrate(2339) FIXME: Property 'hot' does not exist on type 'NodeModule'... Remove this comment to see the full error message
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};

export default configureStore();
