// @flow
import { createAction } from 'redux-actions';
import { fetchWithNotifications, put } from '../utils';
import settings from '../../../settings';

const updateConfigItemAction: Function = (intfc: string): Function =>
  createAction(
    `${intfc}_UPDATE_CONFIG_ITEM`,
    (
      id: number | string,
      configItemName: string,
      newValue: any,
      dispatch: Function
    ): void => {
      const intfcToApiPath: Object = {
        WORKFLOWS: 'steps',
        SERVICES: 'services',
        JOBS: 'jobs',
      };

      fetchWithNotifications(
        async (): Promise<*> =>
          await put(
            `${settings.REST_BASE_URL}/${
              intfcToApiPath[intfc]
            }/${id}/config/${configItemName}?value=${newValue}`
          ),
        `Updating value for ${configItemName}...`,
        `${configItemName} value updated successfuly`,
        dispatch
      );
    }
  );

export { updateConfigItemAction };
