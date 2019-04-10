import { createAction } from 'redux-actions';

const remoteChanged: Function = createAction(
  'HEALTH_REMOTECHANGED',
  events => ({ events })
);

export { remoteChanged };
