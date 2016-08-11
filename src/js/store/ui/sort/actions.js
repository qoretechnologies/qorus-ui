import { createAction } from 'redux-actions';

import actions from '../../../constants/sort';

export const changeSort = createAction(
  actions.CHANGE_SORT,
  (tableName, sortBy, direction, ignoreCase = true) => ({
    tableName,
    sortBy,
    sortByKey: {
      direction,
      ignoreCase,
    },
  })
);

