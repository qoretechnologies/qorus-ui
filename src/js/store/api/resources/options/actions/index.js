// @flow
import { createAction } from 'redux-actions';

import { fetchJson, fetchWithNotifications } from '../../../utils';
import settings from '../../../../../settings';

const setOption: Function = createAction(
  'SYSTEMOPTIONS_SETOPTION',
  async (
    option: string,
    value: any,
    onSuccess: Function,
    dispatch: Function
  ): Object => {
    fetchWithNotifications(
      async () => {
        const res = await fetchJson(
          'PUT',
          `${settings.REST_BASE_URL}/system/options/${option}`,
          {
            body: JSON.stringify({
              action: 'set',
              value,
            }),
          }
        );

        if (!res.error) {
          onSuccess();
        }

        return res;
      },
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
