import isArray from 'lodash/isArray';
import isBoolean from 'lodash/isBoolean';
import isFunction from 'lodash/isFunction';
import isNull from 'lodash/isNull';
import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';

const functionOrStringExp: Function = (item: Function | string, ...itemArguments) =>
  typeof item === 'function' ? item(...itemArguments) : item;

const getType: Function = (item: any): string => {
  if (isBoolean(item)) {
    return 'boolean';
  }

  if (isString(item)) {
    return 'string';
  }

  if (isNumber(item)) {
    return 'number';
  }

  if (isArray(item)) {
    return 'array';
  }

  if (isObject(item)) {
    return 'object';
  }

  if (isFunction(item)) {
    return 'function';
  }

  if (isNull(item) || isUndefined(item)) {
    return 'null';
  }

  return 'null';
};

export const isFeatureEnabled = (feature: string): boolean => {
  return process.env[`REACT_APP_${feature}`] === 'true';
};

export const insertAtIndex = (array: any[] = [], index = 0, value) => {
  return [...array.slice(0, index), value, ...array.slice(index)];
};

export { functionOrStringExp, getType };
