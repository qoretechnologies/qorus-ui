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


function getDebugSessionKey() {
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return matches && matches[1];
}


function developmentSetup({ persistState }, DevTools) {
  const finalCreateStore = compose(
    applyMiddleware(thunk, promise),
    DevTools.instrument(),
    persistState(getDebugSessionKey())
  )(createStore);

  const store = finalCreateStore(reducers);

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(require('./reducers').default);
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
        require.ensure([
          'redux-devtools',
          '../components/devTools'
        ], require => {
          resolve(developmentSetup(
            require('redux-devtools'),
            require('../components/devTools').default
          ));
        }, 'devtools');
        break;
    }
  });
}


export default setupStore;
