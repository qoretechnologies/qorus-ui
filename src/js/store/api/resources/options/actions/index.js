// @flow
import { createAction } from 'redux-actions';

import { fetchJson, fetchWithNotifications } from '../../../utils';
import settings from '../../../../../settings';

const setOption: Function = createAction(
  'SYSTEMOPTIONS_SETOPTION',
  async (option: string, value: any, dispatch: Function): Object => {
    fetchWithNotifications(
      async () =>
        await fetchJson(
          'PUT',
          `${settings.REST_BASE_URL}/system/options/${option}`,
          {
            body: JSON.stringify({
              action: 'set',
              value,
            }),
          }
        ),
      `Saving ${option}...`,
      'Changes saved successfuly',
      dispatch
    );

    return {
      option,
      value,
    };
  }
);

export { setOption };
