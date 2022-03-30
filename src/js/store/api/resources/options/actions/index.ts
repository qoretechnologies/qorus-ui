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
  // @ts-expect-error ts-migrate(1055) FIXME: Type 'ObjectConstructor' is not a valid async func... Remove this comment to see the full error message
  ): Object => {
    fetchWithNotifications(
      async () => {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 5 arguments, but got 3.
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
