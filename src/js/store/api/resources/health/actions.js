import { createAction } from 'redux-actions';

const remoteHealthChanged: Function = createAction(
  'HEALTH_CHANGED',
  events => ({ events })
);

export { remoteHealthChanged };
