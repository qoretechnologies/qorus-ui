/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import moment from 'moment';

import { DATE_FORMATS } from '../../constants/dates';

type Props = {
  date?: number | string,
  format?: string,
};

const DateComponent: Function = ({
  date,
  format: format = DATE_FORMATS.DISPLAY,
}: Props): React.Element<any> =>
  date ? <span>{moment(date).format(format)}</span> : <span />;

export default pure(['date', 'format'])(DateComponent);
