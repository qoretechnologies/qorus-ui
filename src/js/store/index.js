import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import reducers from './reducers';

function productionSetup() {
  const finalCreateStore = applyMiddleware(
    thunk,
    promise
  )(createStore);

  return finalCreateStore(reducers);
}

function developmentSetup(reduxDevTools) {
  const { devTools, persistState } = reduxDevTools;

  const finalCreateStore = compose(
    applyMiddleware(thunk, promise),
    devTools(),
    persistState(
      window.location.href.match(/[?&]debug_session=([^&]+)\b/)
    )
  )(createStore);

  const store = finalCreateStore(reducers);

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(require('./reducers'));
    });
  }

  return store;
}

function setupStore(env) {
  return new Promise(resolve => {
    switch (env) {
      case 'production':
        resolve(productionSetup());
        break;
      default:
        require.ensure(['redux-devtools'], (require) => {
          resolve(developmentSetup(require('redux-devtools')));
        }, 'devtools');
        break;
    }
  });
}


export default setupStore;
