import React, { PropTypes } from 'react';
import { isBoolean, startsWith, isObject } from 'lodash';
import moment from 'moment';

import { DATE_FORMATS } from '../../constants/dates';

import Date from '../date';

const DURATION_PTR = /^([\d]{4})-([\d]{2})-([\d]{2})\s([\d]{2}):([\d]{2}):([\d]{2}).([\d]{2})([\d]{4})Z$/;

/**
 * Indent value for stringified complex values.
 */
const COMPLEX_VALUE_INDENT = 4;

function humanizeDuration(dur) {
  const groups = DURATION_PTR.exec(dur);
  const [
    years, months, days, hours,
    minutes, seconds, milliseconds,
    microseconds,
  ] = groups.slice(1, 9);

  let output = '';

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

function isDate(val) {
  return moment.isDate(new Date(val)) || startsWith(val, '0000-00-00');
}

export default function AutoComponent(props) {
  let comp;

  if (!props.children) return null;

  if (isBoolean(props.children)) {
    if (props.children) {
      comp = <i className="fa fa-check-circle text-success" />;
    } else {
      comp = <i className="fa fa-minus-circle text-danger" />;
    }
  } else if (isDate(props.children)) {
    if (!props.children.match(DURATION_PTR)) {
      comp = <Date date={ props.children } />;
    } else {
      comp = (
        <span>
          { humanizeDuration(props.children) }
        </span>
      );
    }
  } else if (isObject(props.children)) {
    comp = <pre>{JSON.stringify(props.children, null, COMPLEX_VALUE_INDENT)}</pre>;
  } else {
    comp = props.children;
  }

  return (
    <span>{ comp }</span>
  );
}


AutoComponent.propTypes = {
  children: PropTypes.any,
};
