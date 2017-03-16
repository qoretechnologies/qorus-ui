/* @flow */
import { createAction } from 'redux-actions';

import { buildSorting } from '../../../../helpers/table';
import { fetchJson } from '../../utils';
import settings from '../../../../settings';

const unSyncCurrentUser: Function = createAction(
  'CURRENTUSER_UNSYNCCURRENTUSER',
);

const updateStorage: Function = createAction(
  'CURRENTUSER_UPDATESTORAGE',
  (storage: Object, username: string): Object => {
    fetchJson(
      'PUT',
      `${settings.REST_BASE_URL}/users/${username}`,
      {
        body: JSON.stringify({
          storage,
        }),
      }
    );

    return { storage };
  }
);

const storeSortChange: Function = (
  table: string,
  sortData: Object
): Function => (dispatch: Function, getState: Function): void => {
  const {
    ui: { sort },
    api: {
      currentUser: {
        data: {
          username,
          storage = {
            [table]: {},
          },
        },
      },
    },
  } = getState();

  const newSort: Object = buildSorting(sortData, table, sort);

  storage[table] = storage[table] || {};
  storage[table].sort = newSort;

  dispatch(updateStorage(storage, username));
};

const storePaneSize: Function = (
  type: string,
  id: number,
  width: number,
  username: Object
): Function => (dispatch: Function, getState: Function): void => {
  const storage = getState().api.currentUser.data.storage || {};

  storage[type] = storage[type] || {};
  storage[type][id] = width;

  dispatch(updateStorage(storage, username));
};

export {
  unSyncCurrentUser,
  updateStorage,
  storeSortChange,
  storePaneSize,
};
