import { createAction } from 'redux-actions';

import actions from '../../../constants/sort';
import allActions from '../../api/actions';

const changeSortAction = createAction(
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

export const changeSort = (tableName, sortBy, direction, ignoreCase = true) => (dispatch) => {
  dispatch(changeSortAction(tableName, sortBy, direction, ignoreCase));
  dispatch(allActions.currentUser.storeSortChange(tableName, {
    sortBy,
    sortByKey: {
      direction,
      ignoreCase,
    },
  }));
};

export const initSort = createAction(
  actions.INIT_SORT,
  (tableName, sortData) => ({ tableName, sortData })
);
