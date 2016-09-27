/* @flow */
import { createAction } from 'redux-actions';

import actions from '../../../../constants/alerts';

const markAllAsRead: Function = createAction(
  actions.MARK_ALL_AS_READ,
  (type: ?string = null) => ({ type })
);

const raised: Function = createAction(
  actions.RAISED,
  (data: Object, type: string): Object => ({ data, type })
);

const updateDone: Function = createAction(
  actions.UPDATEDONE,
  (id: number): Object => ({ id })
);

const cleared: Function = createAction(
  actions.CLEARED,
  (id: number): Object => ({ id })
);

export {
  markAllAsRead,
  raised,
  cleared,
  updateDone,
};
