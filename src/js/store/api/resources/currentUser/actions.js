/* @flow */
import { createAction } from 'redux-actions';

import { buildSorting } from '../../../../helpers/table';
import { fetchJson } from '../../utils';
import settings from '../../../../settings';

const unSyncCurrentUser: Function = createAction(
  'CURRENTUSER_UNSYNCCURRENTUSER',
);

const storeSortChangeAction: Function = createAction(
  'CURRENTUSER_STORESORTCHANGE',
  (table: string, sort: Object, username: string): Object => {
    fetchJson(
      'PUT',
      `${settings.REST_BASE_URL}/users/${username}`,
      {
        body: JSON.stringify({
          storage: {
            [table]: {
              sort,
            },
          },
        }),
      }
    );

    return {
      table,
      sort,
    };
  }
);

const storeSortChange: Function = (
  table: string,
  sortData: Object
): Function => (dispatch: Function, getState: Function): void => {
  const { ui: { sort }, api: { currentUser: { data: { username } } } } = getState();
  const sorting: Object = buildSorting(sortData, table, sort);

  dispatch(storeSortChangeAction(table, sorting, username));
};

export {
  unSyncCurrentUser,
  storeSortChangeAction,
  storeSortChange,
};
