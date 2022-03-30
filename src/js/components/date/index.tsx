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
  format = DATE_FORMATS.DISPLAY,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> =>
  date ? <span>{moment(date).format(format)}</span> : <span />;

export default pure(['date', 'format'])(DateComponent);
