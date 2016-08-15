/* @flow */
import React from 'react';
import moment from 'moment';

import { DATE_FORMATS } from '../../constants/dates';

type Props = {
  date: number | string,
  format?: string,
}

export default function DateComponent(props: Props): React.Element<any> {
  if (props.date) {
    return (
      <span>{ moment(props.date).format(props.format) }</span>
    );
  }

  return <span />;
}

DateComponent.defaultProps = {
  format: DATE_FORMATS.DISPLAY,
};
