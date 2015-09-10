import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import reducers from './reducers';

const finalCreateStore = applyMiddleware(thunk, promise)(createStore);
const store = finalCreateStore(reducers);

export default store;
