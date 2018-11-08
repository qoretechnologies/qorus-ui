import { createAction } from 'redux-actions';
import ACTIONS from './types';

export const addNotification: Function = createAction(ACTIONS.ADD, events => ({
  events,
}));

export const readNotifications: Function = createAction(ACTIONS.READ);

export const dismissNotification: Function = createAction(
  ACTIONS.DISMISS,
  id => ({ id })
);
