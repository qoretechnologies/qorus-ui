import { combineReducers } from 'redux';
import menu from './menu';
import qorusApi from '../lib/qorus-api';

const restReducers = qorusApi.reducers;

export default combineReducers(
  Object.assign({}, restReducers, { menu: menu})
);
