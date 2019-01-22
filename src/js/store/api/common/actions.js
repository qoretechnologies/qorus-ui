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
      belongsTo: string,
      dispatch: Function
    ): void => {
      const intfcToApiPath: Object = {
        WORKFLOWS: 'steps',
        SERVICES: 'services',
        JOBS: 'jobs',
      };

      const url =
        belongsTo === 'Global Config'
          ? `${settings.REST_BASE_URL}/system/config/${configItemName}`
          : `${settings.REST_BASE_URL}/${
            intfcToApiPath[intfc]
          }/${id}/config/${configItemName}`;

      fetchWithNotifications(
        async (): Promise<*> =>
          await put(url, {
            body: JSON.stringify({
              value: newValue,
            }),
          }),
        `Updating value for ${configItemName}...`,
        `${configItemName} value updated successfuly`,
        dispatch
      );
    }
  );

const updateBasicDataAction: Function = (intfc: string): Function =>
  createAction(`${intfc}_UPDATEBASICDATA`, events => ({ events }));

export { updateConfigItemAction, updateBasicDataAction };
