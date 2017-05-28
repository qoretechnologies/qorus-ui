// @flow
import React from 'react';
import isBoolean from 'lodash/isBoolean';
import startsWith from 'lodash/startsWith';
import moment from 'moment';
import DateComponent from '../date';
import Icon from '../icon';
import Text from '../text';
import pure from 'recompose/onlyUpdateForKeys';

/* eslint-disable */
const DURATION_PTR: any = /^([\d]{4})-([\d]{2})-([\d]{2})\s([\d]{2}):([\d]{2}):([\d]{2}).([\d]{2})([\d]{4})Z$/;
/* eslint-enable */

function humanizeDuration(dur: string): string {
  const groups: Array<number> = DURATION_PTR.exec(dur);
  const [
    years, months, days, hours,
    minutes, seconds, milliseconds,
    microseconds,
  ]: Array<number> = groups.slice(1, 9);

  let output: string = '';

  if (years > 0) output += `${years} yrs `;
  if (months > 0) output += `${months} months `;
  if (days > 0) output += `${days} dys `;
  if (hours > 0) output += `${hours} hrs `;
  if (minutes > 0) output += `${minutes} min `;
  if (seconds > 0) output += `${seconds} sec `;
  if (milliseconds > 0) output += `${milliseconds} ms `;
  if (microseconds > 0) output += `${microseconds} μs `;

  return output;
}

function isDate(val: string): boolean {
  return moment(val, 'YYYY-MM-DD HH:mm:ss', true).isValid() ||
    moment(val, 'YYYY-MM-DDTHH:mm:ss', true).isValid() ||
    moment(val, 'YYYY-MM-DDTHH:mm:ss.SSSSSS +01:00', true).isValid() ||
    startsWith(val, '0000-00-00');
}

const AutoComponent: Function = ({ children }: { children: any }) => {
  let comp;

  if (children === null || children === 'undefined') {
    return null;
  }

  if (isBoolean(children)) {
    if (children) {
      return <Icon icon="check-circle" className="text-success" />;
    }

    return <Icon icon="minus-circle" className="text-danger" />;
  } else if (isDate(children)) {
    if (!children.match(DURATION_PTR)) {
      comp = <DateComponent date={ children } />;
    } else {
      comp = (
        <Text text={humanizeDuration(children)} />
      );
    }
  } else {
    comp = children;
  }

  return (
    <Text text={comp} renderTree />
  );
};

export default pure(['children'])(AutoComponent);
