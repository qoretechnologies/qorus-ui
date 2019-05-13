// @flow
import { createAction } from 'redux-actions';
import { fetchWithNotifications, put, get } from '../utils';
import settings from '../../../settings';

const updateConfigItemAction: Function = (intfc: string): Function =>
  createAction(
    `${intfc}_UPDATE_CONFIG_ITEM`,
    (
      id: number | string,
      stepId: ?number,
      configItemName: string,
      newValue: any,
      belongsTo: string,
      isOverride: boolean,
      onSuccess: Function,
      dispatch: Function
    ): void => {
      const intfcToApiPath: Object = {
        WORKFLOWS: stepId ? 'steps' : 'workflows',
        SERVICES: 'services',
        JOBS: 'jobs',
      };

      const url =
        belongsTo === 'Global Config'
          ? `${
            settings.REST_BASE_URL
          }/system/config/${configItemName}?action=yaml`
          : `${settings.REST_BASE_URL}/${intfcToApiPath[intfc]}/${stepId ||
              id}/config/${configItemName}?action=yaml`;

      fetchWithNotifications(
        async (): Promise<*> => {
          const res = await put(url, {
            body: JSON.stringify(
              isOverride
                ? {
                  override: true,
                }
                : {
                  value: newValue,
                  override: false,
                }
            ),
          });

          if (!res.err) {
            onSuccess();
          }

          return res;
        },
        `Updating value for ${configItemName}...`,
        `${configItemName} value updated successfuly`,
        dispatch
      );
    }
  );

const updateBasicDataAction: Function = (intfc: string): Function =>
  createAction(`${intfc}_UPDATEBASICDATA`, events => ({ events }));

const fetchLoggerAction: Function = (intfc: string): Function =>
  createAction(
    `${intfc.toUpperCase()}_FETCHLOGGER`,
    async (id: number, dispatch: Function) => {
      const loggerPath: string = id ? `/${id}/logger` : '/logger';
      const appendersPath: string = id
        ? `/${id}/logger/appenders`
        : '/logger/appenders';

      const logger: Object = await fetchWithNotifications(
        async () =>
          await get(`${settings.REST_BASE_URL}/${intfc}/${loggerPath}`),
        null,
        null,
        dispatch
      );

      if (logger !== 'success') {
        const appenders: Object = await fetchWithNotifications(
          async () =>
            await get(`${settings.REST_BASE_URL}/${intfc}/${appendersPath}`),
          null,
          null,
          dispatch
        );

        return {
          logger,
          appenders: appenders === 'success' ? [] : appenders,
          id,
        };
      }

      return { id, empty: true };
    }
  );

const addUpdateLoggerAction: Function = (intfc: string): Function =>
  createAction(`${intfc.toUpperCase()}_ADDUPDATELOGGER`, events => ({
    events,
  }));

const deleteLoggerAction: Function = (intfc: string): Function =>
  createAction(`${intfc.toUpperCase()}_DELETELOGGER`, events => ({
    events,
  }));

const addAppenderAction: Function = (intfc: string): Function =>
  createAction(`${intfc.toUpperCase()}_ADDAPPENDER`, events => ({
    events,
  }));

const deleteAppenderAction: Function = (intfc: string): Function =>
  createAction(`${intfc.toUpperCase()}_DELETEAPPENDER`, events => ({
    events,
  }));

const updateConfigItemWsCommon: Function = (intfc: string): Function =>
  createAction(`${intfc.toUpperCase()}_UPDATECONFIGITEMWS`, events => ({
    events,
  }));

export {
  updateConfigItemAction,
  updateBasicDataAction,
  fetchLoggerAction,
  addUpdateLoggerAction,
  deleteLoggerAction,
  addAppenderAction,
  deleteAppenderAction,
  updateConfigItemWsCommon,
};
