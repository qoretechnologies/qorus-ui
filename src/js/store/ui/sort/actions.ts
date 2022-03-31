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

export const changeSort =
  (tableName, sortBy, direction, ignoreCase = true) =>
  (dispatch) => {
    dispatch(changeSortAction(tableName, sortBy, direction, ignoreCase));
    // @ts-ignore ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
    dispatch(
      allActions.currentUser.storeSortChange(tableName, {
        sortBy,
        sortByKey: {
          direction,
          ignoreCase,
        },
      })
    );
  };

export const initSort = createAction(actions.INIT_SORT, (tableName, sortData) => ({
  tableName,
  sortData,
}));
