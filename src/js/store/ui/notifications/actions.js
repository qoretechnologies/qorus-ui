import { createAction } from 'redux-actions';
import ACTIONS from './types';

export const addNotification: Function = createAction(ACTIONS.ADD, events => ({
  events,
}));
