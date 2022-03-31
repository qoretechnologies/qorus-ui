/* @flow */
import { createAction } from 'redux-actions';
import actions from '../../../../constants/alerts';

const markAllAsRead: Function = createAction(
  actions.MARK_ALL_AS_READ,
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  (type: string = null) => ({ type })
);

const raised: Function = createAction(
  actions.RAISED,
  (events: Array<Object>): Object => ({ events })
);

const updateDone: Function = createAction(actions.UPDATEDONE, (id: number): Object => ({ id }));

const cleared: Function = createAction(
  actions.CLEARED,
  (events: Array<Object>): Object => ({ events })
);

export { markAllAsRead, raised, cleared, updateDone };
