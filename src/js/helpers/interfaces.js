// @flow
import size from 'lodash/size';
import map from 'lodash/map';

const mapConfigToArray = (id: number): Function => (
  configItem: Object,
  configKey: string
): Object => ({
  ...configItem,
  name: configKey,
  id,
});

const pullConfigFromStepinfo: Function = (
  stepArray: Array<Object>
): Array<Object> => {
  const resultArray: Array<Object> = [];

  stepArray
    .filter((step: Object): boolean => step.config)
    .forEach(
      (step: Object): void => {
        const newConfig: Array<Object> = map(
          step.config,
          mapConfigToArray(step.stepid)
        );

        resultArray.push(...newConfig);
      }
    );

  return resultArray;
};

const rebuildConfigHash: Function = (
  configHash: Object,
  id: number,
  pullConfigValues: boolean
): Array<Object> => {
  if (!size(configHash)) {
    return [];
  }

  const configArray: Array<Object> = pullConfigValues
    ? pullConfigFromStepinfo(configHash)
    : map(configHash, mapConfigToArray(id));

  return configArray;
};

export { pullConfigFromStepinfo, rebuildConfigHash };
