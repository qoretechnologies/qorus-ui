import { curry, assignIn } from 'lodash';


export const normalizeId = curry((idAttribute, item) => (
  Object.assign({ id: item[idAttribute] }, item)
));


export const extendDefaults = curry((defaults, item) => (
  assignIn({}, defaults, item)
));


export const normalizeName = curry(item => {
  const { name, version, patch, id } = item;
  const normalizedName = patch ?
    `${name} v${version}.${patch} (${id})` :
    `${name} v${version} (${id})`;

  return Object.assign({ normalizedName }, item);
});

export const checkAlerts = curry(item => {
  const { alerts } = item;

  const hasAlerts = (alerts && alerts.length > 0);

  return Object.assign({ has_alerts: hasAlerts }, item);
});

export const normalizeWorkflowLib = curry(item => {
  const { lib, wffuncs, stepinfo } = item;

  const newLib = Object.assign(
    {},
    { wffuncs, stepfuncs: stepinfo },
    lib,
  );

  return Object.assign({}, item, { lib: newLib });
});
