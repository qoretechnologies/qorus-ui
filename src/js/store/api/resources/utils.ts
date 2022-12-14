// @flow
import { assignIn, curry } from 'lodash';
import { error, success } from '../../ui/bubbles/actions';

export const normalizeId = curry((idAttribute, item) =>
  Object.assign({ id: item[idAttribute] }, item)
);

export const normalizeUnknownId = curry((item) => {
  if (item.classid) {
    return normalizeId('classid', item);
  }

  if (item.stepid) {
    return normalizeId('stepid', item);
  }

  if (item.constantid) {
    return normalizeId('constantid', item);
  }

  if (item.function_instanceid) {
    return normalizeId('function_instanceid', item);
  }

  return item;
});

export const extendDefaults = curry((defaults, item) => assignIn({}, defaults, item));

export const normalizeName = curry((item: any, idKey: string = 'id') => {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
  const { name, version, patch } = item;
  const id = item[idKey];
  const normalizedName = patch
    ? `${name} v${version}.${patch} (${id})`
    : `${name} v${version} (${id})`;

  return Object.assign({ normalizedName }, item);
});

export const checkAlerts = curry((item) => {
  const { alerts } = item;

  const hasAlerts = alerts && alerts.length > 0;

  return Object.assign({ has_alerts: hasAlerts }, item);
});

export const normalizeWorkflowLib = curry((item) => {
  const { lib, wffuncs, stepinfo } = item;

  const newLib = Object.assign({}, { 'WF Functions': wffuncs, 'Step code': stepinfo }, lib);

  return Object.assign({}, item, { lib: newLib });
});

export const findMissingBand: Function = (
  orderStats: Array<Object>
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
): string[] => {
  const bands = ['1_hour_band', '4_hour_band', '24_hour_band'];
  const findMissing =
    (band: string): Function =>
    (stats: any) =>
      // @ts-ignore ts-migrate(2339) FIXME: Property 'label' does not exist on type 'Object'.
      stats.label === band;

  const missing = bands
    // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
    .map((band) => (!orderStats.find(findMissing(band)) ? band : null))
    .filter((band) => band);

  return missing;
};

export const addHasAlerts = curry((item) => {
  const { alerts } = item;

  return { ...item, ...{ has_alerts: alerts && alerts.length !== 0 } };
});

export const processRESTResponse = (
  resp: any,
  dispatch: Function,
  successMsg: string,
  notificationId: string | number
): void => {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'err' does not exist on type 'Object'.
  if (resp && resp.err) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'desc' does not exist on type 'Object'.
    dispatch(error(resp.desc, notificationId));
  } else if (successMsg) {
    dispatch(success(successMsg, notificationId));
  }
};

export const injectStorageDefaults = (currentUserData: any): any => {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'storage' does not exist on type 'Object'... Remove this comment to see the full error message
  let { storage } = currentUserData;

  if (!storage) {
    storage = {};
  }

  if (!storage.settings) {
    storage.settings = {
      notificationsEnabled: true,
      notificationsSound: true,
    };
  }

  if (!storage.settings.dashboardModules) {
    storage.settings.dashboardModules = [
      'orderStats',
      'interfaces',
      'connections',
      'cluster',
      'overview',
      'remotes',
      'nodeData',
    ];
  }

  // @ts-ignore ts-migrate(2339) FIXME: Property 'storage' does not exist on type 'Object'... Remove this comment to see the full error message
  currentUserData.storage = storage;

  return currentUserData;
};
