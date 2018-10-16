import { createAction } from 'redux-actions';
import { fetchJson, fetchWithNotifications } from '../../utils';
import settings from '../../../../settings';

const manageProp = createAction(
  'PROPS_MANAGEPROP',
  async (prop: Object, dispatch: Function) => {
    if (dispatch) {
      await fetchWithNotifications(
        async () =>
          await fetchJson(
            'PUT',
            `${settings.REST_BASE_URL}/system/props/${
              prop.domain
            }/${prop.origKey || prop.key}`,
            {
              body: JSON.stringify({
                action: 'set',
                key: prop.key,
                args: prop.value,
              }),
            }
          ),
        'Saving property...',
        'Property saved',
        dispatch
      );
    }

    return { prop };
  }
);

const removeProp = createAction(
  'PROPS_REMOVEPROP',
  async (prop: Object, dispatch: Function): Promise<*> => {
    if (!dispatch) {
      return { prop };
    }

    const url = prop.key ? `${prop.domain}/${prop.key}` : prop.domain;

    await fetchWithNotifications(
      async () =>
        await fetchJson(
          'DELETE',
          `${settings.REST_BASE_URL}/system/props/${url}`
        ),
      'Removing property...',
      'Property removed',
      dispatch
    );

    return { prop };
  }
);

const addPropOptimistic: Function = () => () => true;
const updatePropOptimistic: Function = () => () => true;

export { manageProp, removeProp, addPropOptimistic, updatePropOptimistic };
