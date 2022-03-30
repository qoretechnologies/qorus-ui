import includes from 'lodash/includes';
import isObject from 'lodash/isObject';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
// @flow
import size from 'lodash/size';
import { normalizeName } from '../components/utils';
import { INTERFACE_ID_KEYS, INTERFACE_ID_LINKS } from '../constants/interfaces';
import { normalizeId } from '../store/api/resources/utils';


const mapConfigToArray = (id: number, globalView: boolean): Function => (
  configItem: Object,
  configKey: string
): Object => ({
  ...configItem,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
  name: globalView ? configItem.name : configKey,
  id: globalView ? null : id,
});

const pullConfigFromStepinfo: Function = (
  stepArray: Array<Object>,
  id: number
): Object => {
  const resultObj: Object = {};

  stepArray
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'config' does not exist on type 'Object'.
    .filter((step: Object): boolean => step.config)
    .forEach((step: Object): void => {
      const newConfig: Array<Object> = map(
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'config' does not exist on type 'Object'.
        step.config,
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        mapConfigToArray(step.stepid)
      );

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
      const belongsTo: string = `${step.name} v${step.version} (${step.stepid}) [${step.steptype}]`;

      resultObj[belongsTo] = {
        id,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'stepid' does not exist on type 'Object'.
        stepId: step.stepid,
        data: newConfig,
      };
    });

  return resultObj;
};

const rebuildConfigHash: Function = (
  model: Object,
  pullConfigValues: boolean,
  isGlobal: Boolean,
  id,
): Object => {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'stepinfo' does not exist on type 'Object... Remove this comment to see the full error message
  const configHash = pullConfigValues ? model.stepinfo : model.config || {};
  const configObj: Object = pullConfigValues
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
    ? pullConfigFromStepinfo(configHash, id || model.id)
    : {
        [normalizeName(model)]: {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
          id: id || model.id,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
          data: map(configHash, mapConfigToArray(id || model.id, isGlobal)),
          isGlobal,
        },
      };

  let resultObj = { ...configObj };

  if (!size(resultObj)) {
    return {};
  }

  return resultObj;
};

const normalizeItem: Function = (item: Object): Object => {
  let normalized: Object = item;

  //! Check if the item passed is actually object
  if (!isObject(normalized)) {
    return normalized;
  }

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'normalized' does not exist on type 'Obje... Remove this comment to see the full error message
  if (!normalized.normalized) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
    if (item.id) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
      normalized.name = normalizeName(normalized);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'normalized' does not exist on type 'Obje... Remove this comment to see the full error message
      normalized.normalized = true;
    } else {
      INTERFACE_ID_KEYS.forEach((idKey: string): void => {
        if (idKey in item) {
          normalized = normalizeId(idKey, item);
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
          normalized.name = normalizeName(normalized);
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'normalized' does not exist on type 'Obje... Remove this comment to see the full error message
          normalized.normalized = true;
        }
      });
    }
  }

  return normalized;
};

const buildLinkToInterfaceId: Function = (
  interFace: string,
  id: number | string
): string => {
  const idLink: string = INTERFACE_ID_LINKS[interFace.toLowerCase()];

  if (idLink) {
    return `${idLink}${id}`;
  }

  return '';
};

const objectCollectionToArray: Function = (
  collection: Object,
  keyName: string = 'name'
): Array<Object> =>
  reduce(
    collection,
    (newCollection: Array<Object>, datum: Object, key: string) => [
      ...newCollection,
      { [keyName]: key, ...datum },
    ],
    []
  );

const arrayCollectionToObject: Function = (
  collection: Object,
  keyName: string = 'name'
): Array<Object> =>
  reduce(
    collection,
    (newCollection: Object, datum: Object, key: string) => ({
      ...newCollection,
      [datum[keyName]]: datum,
    }),
    {}
  );

const getInstancesCountByFilters = (
  filters: Array<string>,
  model: Object
): number => {
  const transformedFilters: Array<string> = filters.map((filter: string) =>
    filter.toLowerCase()
  );

  return reduce(
    model,
    (result: number, status: number, key: string) => {
      if (includes(transformedFilters, key.toLowerCase())) {
        return result + status;
      }

      return result;
    },
    0
  );
};

export {
  arrayCollectionToObject, buildLinkToInterfaceId, getInstancesCountByFilters,
  normalizeItem, objectCollectionToArray, pullConfigFromStepinfo,
  rebuildConfigHash
};
