// @flow
import React from 'react';
import isBoolean from 'lodash/isBoolean';
import startsWith from 'lodash/startsWith';
import moment from 'moment';
import Icon from '../icon';
import Text from '../text';
import pure from 'recompose/onlyUpdateForKeys';
import { DATE_FORMATS } from '../../constants/dates';

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
      return <Icon iconName="check-circle" className="text-success" />;
    }

    return <Icon iconName="minus-circle" className="text-danger" />;
  } else if (isDate(children)) {
    comp = moment(children).format(DATE_FORMATS.DISPLAY);
  } else {
    comp = children;
  }

  return (
    <Text text={comp} renderTree />
  );
};

export default pure(['children'])(AutoComponent);
