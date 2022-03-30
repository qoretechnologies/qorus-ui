import { createAction } from 'redux-actions';
import { fetchJson, fetchWithNotifications } from '../../utils';
import settings from '../../../../settings';

const manageProp = createAction(
  'PROPS_MANAGEPROP',
  async (prop: Object, dispatch: Function) => {
    if (dispatch) {
      await fetchWithNotifications(
        async () =>
          // @ts-expect-error ts-migrate(2554) FIXME: Expected 5 arguments, but got 3.
          await fetchJson(
            'PUT',
            `${settings.REST_BASE_URL}/system/props/${
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'domain' does not exist on type 'Object'.
              prop.domain
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'origKey' does not exist on type 'Object'... Remove this comment to see the full error message
            }/${prop.origKey || prop.key}`,
            {
              body: JSON.stringify({
                action: 'set',
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'key' does not exist on type 'Object'.
                key: prop.key,
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Object'.
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
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  async (prop: Object, dispatch: Function): Promise<*> => {
    if (!dispatch) {
      return { prop };
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'key' does not exist on type 'Object'.
    const url = prop.key ? `${prop.domain}/${prop.key}` : prop.domain;

    await fetchWithNotifications(
      async () =>
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
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
