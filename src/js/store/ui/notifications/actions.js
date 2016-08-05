/* @flow */
import { createAction } from 'redux-actions';
import shortid from 'shortid';

import { default as actions, statuses } from '../../../constants/notifications';

export const sendNotification = createAction(
  actions.ADD_NOTIFICATION,
  (type: string, message: string) => ({ type, message, id: shortid.generate() })
);

export const deleteNotification = createAction(
  actions.DELETE_NOTIFICATION,
  (id: string) => id
);


export const success = (message: string) => sendNotification(statuses.SUCCESS, message);
export const warning = (message: string) => sendNotification(statuses.WARNING, message);
export const error = (message: string) => sendNotification(statuses.ERROR, message);
