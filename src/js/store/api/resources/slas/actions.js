// @flow
import { createAction } from 'redux-actions';

import { fetchJson } from '../../utils';
import settings from '../../../../settings';
import { error, success } from '../../../ui/bubbles/actions';

const removeSla: Function = createAction(
  'SLAS_REMOVESLA',
  (id: number): Object => {
    fetchJson(
      'DELETE',
      `${settings.REST_BASE_URL}/slas/${id}`,
    );

    return { id };
  }
);

const createSla: Function = createAction(
  'SLAS_CREATESLA',
  async (
    name: string,
    description: string,
    units: string,
    optimistic: boolean,
    dispatch: Function,
  ): Object => {
    if (optimistic) {
      return {
        name,
        description,
        units,
      };
    }

    const res = await fetchJson(
      'POST',
      `${settings.REST_BASE_URL}/slas/`,
      {
        body: JSON.stringify({
          name,
          description,
          units,
        }),
      },
      true
    );

    if (res.err) {
      dispatch(error(res.desc));

      return { name, error: true };
    }

    return res;
  }
);

const create = (
  name: string,
  desc: string,
  type: string
): Function => (dispatch: Function): void => {
  dispatch(createSla(name, desc, type, true));
  dispatch(createSla(name, desc, type, false, dispatch));
};

const unsync = createAction('SLAS_UNSYNC');

export {
  removeSla,
  createSla,
  create,
  unsync,
};
