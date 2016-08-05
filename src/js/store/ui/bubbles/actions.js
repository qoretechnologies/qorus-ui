/* @flow */
import { createAction } from 'redux-actions';
import shortid from 'shortid';

import { default as actions, statuses } from '../../../constants/bubbles';

export const sendBubble = createAction(
  actions.ADD_BUBBLE,
  (type: string, message: string) => ({ type, message, id: shortid.generate() })
);

export const deleteBubble = createAction(
  actions.DELETE_BUBBLE,
  (id: string) => id
);


export const success = (message: string) => sendBubble(statuses.SUCCESS, message);
export const warning = (message: string) => sendBubble(statuses.WARNING, message);
export const error = (message: string) => sendBubble(statuses.ERROR, message);
