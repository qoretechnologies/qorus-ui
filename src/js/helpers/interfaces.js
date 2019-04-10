// @flow
import size from 'lodash/size';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import isObject from 'lodash/isObject';
import includes from 'lodash/includes';

import { normalizeName } from '../components/utils';
import { INTERFACE_ID_KEYS, INTERFACE_ID_LINKS } from '../constants/interfaces';
import { normalizeId } from '../store/api/resources/utils';

const mapConfigToArray = (id: number): Function => (
  configItem: Object,
  configKey: string
): Object => ({
  ...configItem,
  name: configKey,
  id,
});

const pullConfigFromStepinfo: Function = (
  stepArray: Array<Object>,
  id: number
): Object => {
  const resultObj: Object = {};

  stepArray
    .filter((step: Object): boolean => step.config)
    .forEach(
      (step: Object): void => {
        const newConfig: Array<Object> = map(
          step.config,
          mapConfigToArray(step.stepid)
        );

        const belongsTo: string = `${step.name} v${step.version} (${
          step.stepid
        }) [${step.steptype}]`;

        resultObj[belongsTo] = {
          id,
          stepId: step.stepid,
          data: newConfig,
        };
      }
    );

  return resultObj;
};

const rebuildConfigHash: Function = (
  model: Object,
  pullConfigValues: boolean
): Object => {
  const configHash = pullConfigValues ? model.stepinfo : model.config || {};
  const configObj: Object = pullConfigValues
    ? pullConfigFromStepinfo(configHash, model.id)
    : {
      [normalizeName(model)]: {
        id: model.id,
        data: map(configHash, mapConfigToArray(model.id)),
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

  if (!normalized.normalized) {
    if (item.id) {
      normalized.name = normalizeName(normalized);
      normalized.normalized = true;
    } else {
      INTERFACE_ID_KEYS.forEach(
        (idKey: string): void => {
          if (idKey in item) {
            normalized = normalizeId(idKey, item);
            normalized.name = normalizeName(normalized);
            normalized.normalized = true;
          }
        }
      );
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
  pullConfigFromStepinfo,
  rebuildConfigHash,
  normalizeItem,
  buildLinkToInterfaceId,
  objectCollectionToArray,
  getInstancesCountByFilters,
};
