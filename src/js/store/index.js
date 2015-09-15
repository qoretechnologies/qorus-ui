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
  )
)(createStore);

function configureStore() {
  const store = finalCreateStore(reducers);

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

export default configureStore();
