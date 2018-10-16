/* @flow */
import { createAction } from 'redux-actions';
import isArray from 'lodash/isArray';
import { fetchJson, fetchWithNotifications } from '../../../utils';
import settings from '../../../../../settings';

const setEnabled: Function = createAction('GROUPS_SETENABLED', events => ({
  events,
}));

const updateDone: Function = createAction(
  'GROUPS_UPDATEDONE',
  (name: string) => ({ name })
);

const groupAction: Function = createAction(
  'GROUPS_GROUPACTION',
  (groups: any, action: string, dispatch: Function): Object => {
    const grps = isArray(groups) ? groups.join(',') : groups;

    fetchWithNotifications(
      async () =>
        await fetchJson(
          'PUT',
          `${
            settings.REST_BASE_URL
          }/groups?action=setStatus&enabled=${action}&groups=${grps}`
        ),
      `${action ? 'Enabling' : 'Disabling'} group(s) ${grps}`,
      `Group(s) ${grps} ${action ? 'enabled' : 'disabled'}`,
      dispatch
    );
  }
);

const select = createAction('GROUPS_SELECT', (id: number): Object => ({ id }));
const selectAll = createAction('GROUPS_SELECTALL');
const selectNone = createAction('GROUPS_SELECTNONE');
const selectInvert = createAction('GROUPS_SELECTINVERT');

export {
  setEnabled,
  updateDone,
  groupAction,
  select,
  selectAll,
  selectNone,
  selectInvert,
};
