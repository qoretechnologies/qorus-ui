// @flow
import size from 'lodash/size';
import map from 'lodash/map';
import { normalizeName } from '../components/utils';

const mapConfigToArray = (id: number): Function => (
  configItem: Object,
  configKey: string
): Object => ({
  ...configItem,
  name: configKey,
  id,
});

const pullConfigFromStepinfo: Function = (stepArray: Array<Object>): Object => {
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

        resultObj[belongsTo] = newConfig;
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
    ? pullConfigFromStepinfo(configHash)
    : {
        [normalizeName(model)]: map(configHash, mapConfigToArray(model.id)),
      };

  let resultObj = { ...configObj };

  if (model.global_config) {
    const globalConfigObj: Object = {
      ['Global Config']: map(model.global_config, mapConfigToArray(model.id)),
    };

    resultObj = { ...globalConfigObj, ...resultObj };
  }

  if (!size(resultObj)) {
    return {};
  }

  return resultObj;
};

export { pullConfigFromStepinfo, rebuildConfigHash };
