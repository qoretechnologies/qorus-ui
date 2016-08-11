import { createAction } from 'redux-actions';

import actions from '../../../constants/sort';

export const changeSort = createAction(
  actions.CHANGE_SORT,
  (tableName, field, direction, ignoreCase = true) => ({ tableName, field, direction, ignoreCase })
);

