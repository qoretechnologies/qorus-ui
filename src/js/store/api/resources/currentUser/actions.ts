/* @flow */
import includes from 'lodash/includes';
import { createAction } from 'redux-actions';
import { buildSorting } from '../../../../helpers/table';
import settings from '../../../../settings';
import { fetchJson } from '../../utils';

const unSyncCurrentUser: Function = createAction('CURRENTUSER_UNSYNCCURRENTUSER');

const updateStorage: Function = createAction(
  'CURRENTUSER_UPDATESTORAGE',
  (storage: Object, username: string): Object => {
    // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 3.
    fetchJson('PUT', `${settings.REST_BASE_URL}/users/${username}`, {
      body: JSON.stringify({
        storage,
      }),
    });

    return { storage };
  }
);

const storeSortChange: Function =
  (table: string, sortData: Object): Function =>
  (dispatch: Function, getState: Function): void => {
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

const storePaneSize: Function =
  (type: string, width: number, username: Object): Function =>
  (dispatch: Function, getState: Function): void => {
    const storage = getState().api.currentUser.data.storage || {};

    storage[type] = storage[type] || {};
    storage[type].paneSize = width;

    dispatch(updateStorage(storage, username));
  };

const storeSearch: Function =
  (type: string, query: string, username: Object): Function =>
  (dispatch: Function, getState: Function): void => {
    const storage = getState().api.currentUser.data.storage || {};

    storage[type] = storage[type] || {};
    storage[type].searches = storage[type].searches || [];

    if (!includes(storage[type].searches, query) && query.length > 2) {
      storage[type].searches.unshift(query);

      if (storage[type].searches.length > 15) {
        storage[type].searches.splice(-1, 1);
      }

      dispatch(updateStorage(storage, username));
    }
  };

const storeLocale: Function =
  (locale: string): Function =>
  (dispatch: Function, getState: Function): void => {
    const { storage = {}, username } = getState().api.currentUser.data;

    storage.locale = locale;

    dispatch(updateStorage(storage, username));
  };

const storeSidebar: Function =
  (sidebarOpen: boolean): Function =>
  (dispatch: Function, getState: Function): void => {
    const { storage = {}, username } = getState().api.currentUser.data;

    storage.sidebarOpen = sidebarOpen;

    dispatch(updateStorage(storage, username));
  };

const storeTheme: Function =
  (theme: string): Function =>
  (dispatch: Function, getState: Function): void => {
    const { storage = {}, username } = getState().api.currentUser.data;

    storage.theme = theme;

    dispatch(updateStorage(storage, username));
  };

const storeSettings: Function =
  (setting: string, value: any): Function =>
  (dispatch: Function, getState: Function): void => {
    const { storage = {}, username } = getState().api.currentUser.data;

    storage.settings[setting] = value;

    dispatch(updateStorage(storage, username));
  };

const storeFavoriteMenuItem: Function =
  (items): Function =>
  (dispatch: Function, getState: Function): void => {
    const { storage = {}, username } = getState().api.currentUser.data;

    storage.favoriteMenuItems = storage.favoriteMenuItems || [];
    storage.favoriteMenuItems = [...storage.favoriteMenuItems, ...items];

    dispatch(updateStorage(storage, username));
  };

const clearStorage: Function =
  (): Function =>
  (dispatch: Function, getState: Function): void => {
    const { username } = getState().api.currentUser.data;

    dispatch(updateStorage({}, username));
  };

export {
  unSyncCurrentUser,
  updateStorage,
  storeSortChange,
  storePaneSize,
  storeSearch,
  storeLocale,
  storeSidebar,
  storeTheme,
  clearStorage,
  storeSettings,
  storeFavoriteMenuItem,
};
