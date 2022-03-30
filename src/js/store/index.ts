// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module 'redux' or its corresponding ty... Remove this comment to see the full error message
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

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'hot' does not exist on type 'NodeModule'... Remove this comment to see the full error message
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'hot' does not exist on type 'NodeModule'... Remove this comment to see the full error message
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};

export default configureStore();
