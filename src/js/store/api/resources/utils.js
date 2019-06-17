// @flow
import { curry, assignIn } from 'lodash';
import { error, success } from '../../ui/bubbles/actions';

export const normalizeId = curry((idAttribute, item) =>
  Object.assign({ id: item[idAttribute] }, item)
);

export const normalizeUnknownId = curry(item => {
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

export const extendDefaults = curry((defaults, item) =>
  assignIn({}, defaults, item)
);

export const normalizeName = curry((item: Object, idKey: string = 'id') => {
  const { name, version, patch } = item;
  const id = item[idKey];
  const normalizedName = patch
    ? `${name} v${version}.${patch} (${id})`
    : `${name} v${version} (${id})`;

  return Object.assign({ normalizedName }, item);
});

export const checkAlerts = curry(item => {
  const { alerts } = item;

  const hasAlerts = alerts && alerts.length > 0;

  return Object.assign({ has_alerts: hasAlerts }, item);
});

export const normalizeWorkflowLib = curry(item => {
  const { lib, wffuncs, stepinfo } = item;

  const newLib = Object.assign(
    {},
    { 'WF Functions': wffuncs, 'Step code': stepinfo },
    lib
  );

  return Object.assign({}, item, { lib: newLib });
});

export const findMissingBand: Function = (
  orderStats: Array<Object>
): Array<?string> => {
  const bands = ['1_hour_band', '4_hour_band', '24_hour_band'];
  const findMissing = (band: string): Function => (stats: Object) =>
    stats.label === band;

  const missing = bands
    .map(band => (!orderStats.find(findMissing(band)) ? band : null))
    .filter(band => band);

  return missing;
};

export const addHasAlerts = curry(item => {
  const { alerts } = item;

  return { ...item, ...{ has_alerts: alerts && alerts.length !== 0 } };
});

export const processRESTResponse = (
  resp: Object,
  dispatch: Function,
  successMsg: string,
  notificationId: string | number
): void => {
  if (resp && resp.err) {
    dispatch(error(resp.desc, notificationId));
  } else if (successMsg) {
    dispatch(success(successMsg, notificationId));
  }
};

export const injectStorageDefaults = (currentUserData: Object): Object => {
  let { storage } = currentUserData;

  if (!storage) {
    storage = {};
  }

  if (!storage.settings) {
    storage.settings = {
      notificationsEnabled: true,
      notificationsSound: true,
    };

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
  }

  currentUserData.storage = storage;

  return currentUserData;
};
