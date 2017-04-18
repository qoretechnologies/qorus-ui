import React, { PropTypes } from 'react';
import { isBoolean, startsWith, isObject } from 'lodash';
import moment from 'moment';
import DateComponent from '../date';
import Icon from '../icon';
import Text from '../text';

/* eslint-disable */
const DURATION_PTR: any = /^([\d]{4})-([\d]{2})-([\d]{2})\s([\d]{2}):([\d]{2}):([\d]{2}).([\d]{2})([\d]{4})Z$/;
/* eslint-enable */

/**
 * Indent value for stringified complex values.
 */
const COMPLEX_VALUE_INDENT: number = 4;

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

export default function AutoComponent(props: { children: any }) {
  let comp;

  if (props.children === null || props.children === 'undefined') {
    return null;
  }

  if (isBoolean(props.children)) {
    if (props.children) {
      return <Icon icon="check-circle" className="text-success" />;
    }

    return <Icon icon="minus-circle" className="text-danger" />;
  } else if (isDate(props.children)) {
    if (!props.children.match(DURATION_PTR)) {
      comp = <DateComponent date={ props.children } />;
    } else {
      comp = (
        <Text text={humanizeDuration(props.children)} />
      );
    }
  } else if (isObject(props.children)) {
    return <pre>{JSON.stringify(props.children, null, COMPLEX_VALUE_INDENT)}</pre>;
  } else {
    comp = props.children;
  }

  return (
    <Text text={comp} />
  );
}

AutoComponent.defaultProps = {
  children: null,
};

AutoComponent.propTypes = {
  children: PropTypes.any,
};
