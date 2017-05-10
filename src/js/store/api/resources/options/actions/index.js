// @flow
import { createAction } from 'redux-actions';

import { fetchJson } from '../../../utils';
import settings from '../../../../../settings';

import { error } from '../../../../ui/bubbles/actions';

const setOptionAction: Function = createAction(
  'SYSTEMOPTIONS_SETOPTION',
  async (
    option: string,
    value: any,
    dispatch: Function,
  ): Object => {
    if (dispatch) {
      const response = await fetchJson(
        'PUT',
        `${settings.REST_BASE_URL}/system/options/${option}`,
        {
          body: JSON.stringify({
            action: 'set',
            value,
          }),
        },
        true
      );

      if (response.err) {
        dispatch(error(response.desc));
      }
    }

    return {
      option,
      value,
    };
  }
);

const setOption: Function = (
  option: string,
  value: any,
): Function => (dispatch: Function): void => {
  dispatch(setOptionAction(option, value));
  dispatch(setOptionAction(option, value, dispatch));
};

export {
  setOptionAction,
  setOption,
};
