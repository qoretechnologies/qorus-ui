/* @flow */
import { createAction } from 'redux-actions';
import shortid from 'shortid';

import { default as actions, statuses } from '../../../constants/bubbles';

export const sendBubble = createAction(
  actions.ADD_BUBBLE,
  (type: string, message: string, id: any) => ({
    type,
    message,
    id: id || shortid.generate(),
  })
);

export const deleteBubble = createAction(actions.DELETE_BUBBLE, (id: string) => id);

export const success = (message: string, id?: string | number) =>
  sendBubble(statuses.SUCCESS, message, id);
export const warning = (message: string, id?: string | number) =>
  sendBubble(statuses.WARNING, message, id);
export const error = (message: string, id?: string | number) =>
  sendBubble(statuses.DANGER, message, id);
export const info = (message: string, id?: string | number) =>
  sendBubble(statuses.INFO, message, id);
