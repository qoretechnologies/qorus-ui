/* @flow */
import isArray from 'lodash/isArray';
import { createAction } from 'redux-actions';
import settings from '../../../../../settings';
import { fetchJson, fetchWithNotifications } from '../../../utils';

const setEnabled: Function = createAction('GROUPS_SETENABLED', (events) => ({
  events,
}));

const updateDone: Function = createAction('GROUPS_UPDATEDONE', (name: string) => ({ name }));

const groupAction: Function = createAction(
  'GROUPS_GROUPACTION',
  // @ts-ignore ts-migrate(2355) FIXME: A function whose declared type is neither 'void' n... Remove this comment to see the full error message
  (groups: any, action: string, dispatch: Function): Object => {
    const grps = isArray(groups) ? groups.join(',') : groups;

    fetchWithNotifications(
      async () =>
        // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
        await fetchJson(
          'PUT',
          `${settings.REST_BASE_URL}/groups?action=setStatus&enabled=${action}&groups=${grps}`
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

export { setEnabled, updateDone, groupAction, select, selectAll, selectNone, selectInvert };
