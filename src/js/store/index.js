import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';


import reducers from './reducers';


/**
 * Creates a Redux store with thunk and promise middlewares.
 *
 * @return {Store}
 */
function productionSetup() {
  return createStore(
    reducers,
    applyMiddleware(thunk, promise)
  );
}


/**
 * Retrieves `debug_session` value from location query string.
 *
 * @return {string?}
 */
function getDebugSessionKey() {
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return matches && matches[1];
}


/**
 * Creates a Redux store prepared for development.
 *
 * Mainly, it enables reducer replacement when webpack Hot Module
 * Replacement is enabled.
 *
 * Created store has thunk and promise middlewares in addition to
 * Redux DevTools instrumentation store enhancer. Debug session can be
 * persisted by setting `debug_session` query parameter in URL.
 *
 * @param {function(string): function} persistState
 * @param {ReactComponent} DevTools
 * @return {Store}
 */
function developmentSetup({ persistState }, DevTools) {
  const store = createStore(
    reducers,
    compose(
      applyMiddleware(thunk, promise),
      DevTools.instrument(),
      persistState(getDebugSessionKey())
    )
  );

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(require('./reducers').default);
    });
  }

  return store;
}


/**
 * Sets up Redux store for specific environment.
 *
 * For other than production environment, it loads all the necessities
 * to setup Redux-DevTools-enabled store. It loads it as a webpack
 * chunk named `devtools`.
 *
 * @param {string} env
 * @return {Promise<Store>}
 */
export default function setupStore(env) {
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
