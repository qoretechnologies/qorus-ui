// @flow
import { createAction } from 'redux-actions';

import settings from '../../../settings';
import { del, fetchWithNotifications, get, put } from '../utils';

const updateConfigItemAction: Function = (intfc: string): Function =>
  createAction(
    `${intfc}_UPDATE_CONFIG_ITEM`,
    (
      id: number | string,
      stepId: ?number,
      configItemName: string,
      newValue: any,
      onSuccess: Function,
      dispatch: Function
    ): void => {
      const intfcToApiPath: Object = {
        WORKFLOWS: stepId ? 'steps' : 'workflows',
        SERVICES: 'services',
        JOBS: 'jobs',
        FSMS: 'fsms',
      };

      const value = newValue || 'null';

      const url =
        intfc === 'SYSTEM'
          ? `${settings.REST_BASE_URL}/system/config/${configItemName}?action=yaml`
          : `${settings.REST_BASE_URL}/${intfcToApiPath[intfc]}/${
              stepId || id
            }/config/${configItemName}?action=yaml`;

      fetchWithNotifications(
        async (): Promise<*> => {
          const res = await put(url, {
            body: JSON.stringify({
              value,
            }),
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

const deleteConfigItemAction: Function = (intfc: string): Function =>
  createAction(
    `${intfc}_DELETE_CONFIG_ITEM`,
    (
      id: number | string,
      stepId: ?number,
      configItemName: string,
      onSuccess: Function,
      dispatch: Function
    ): void => {
      const intfcToApiPath: Object = {
        SYSTEM: 'system',
        WORKFLOWS: stepId ? 'steps' : 'workflows',
        SERVICES: 'services',
        JOBS: 'jobs',
        FSMS: 'fsms',
      };

      let realId: number = stepId || id;

      const url = `${settings.REST_BASE_URL}/${intfcToApiPath[intfc]}${
        realId ? `/${realId}` : '/'
      }/config/${configItemName}`;

      fetchWithNotifications(
        async (): Promise<*> => {
          const res = await del(url);

          if (!res.err && onSuccess) {
            onSuccess();
          }

          return res;
        },
        `Deleting value for ${configItemName}...`,
        `${configItemName} value deleted successfuly`,
        dispatch
      );
    }
  );

const updateBasicDataAction: Function = (intfc: string): Function =>
  createAction(`${intfc}_UPDATEBASICDATA`, (events) => ({ events }));

const fetchLoggerAction: Function = (intfc: string, url?: string): Function =>
  createAction(
    `${intfc.toUpperCase()}_FETCHLOGGER`,
    async (id: number | string, dispatch: Function) => {
      const loggerPath: string = id ? `/${id}/logger` : '/logger';
      const appendersPath: string = id
        ? `/${id}/logger/appenders`
        : '/logger/appenders';

      url = url || intfc;

      const logger: Object = await fetchWithNotifications(
        async () =>
          await get(
            `${settings.REST_BASE_URL}/${url}/${loggerPath.toLowerCase()}`
          ),
        null,
        null,
        dispatch
      );

      if (logger !== 'success') {
        const appenders: Object = await fetchWithNotifications(
          async () =>
            await get(
              `${settings.REST_BASE_URL}/${url}/${appendersPath.toLowerCase()}`
            ),
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
  createAction(`${intfc.toUpperCase()}_ADDUPDATELOGGER`, (events) => ({
    events,
  }));

const deleteLoggerAction: Function = (intfc: string): Function =>
  createAction(`${intfc.toUpperCase()}_DELETELOGGER`, (events) => ({
    events,
  }));

const addAppenderAction: Function = (intfc: string): Function =>
  createAction(`${intfc.toUpperCase()}_ADDAPPENDER`, (events) => ({
    events,
  }));

const editAppenderAction: Function = (intfc: string): Function =>
  createAction(`${intfc.toUpperCase()}_EDITAPPENDER`, (events) => ({
    events,
  }));

const deleteAppenderAction: Function = (intfc: string): Function =>
  createAction(`${intfc.toUpperCase()}_DELETEAPPENDER`, (events) => ({
    events,
  }));

const updateConfigItemWsCommon: Function = (intfc: string): Function =>
  createAction(`${intfc.toUpperCase()}_UPDATECONFIGITEMWS`, (events) => ({
    events,
  }));

export {
  addAppenderAction, addUpdateLoggerAction, deleteAppenderAction,
  deleteConfigItemAction, deleteLoggerAction, editAppenderAction,
  fetchLoggerAction, updateBasicDataAction, updateConfigItemAction,
  updateConfigItemWsCommon
};
