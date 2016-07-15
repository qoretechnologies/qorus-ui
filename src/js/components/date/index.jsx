import React from 'react';
import moment from 'moment';

import { DATE_FORMATS } from '../../constants/dates';

export default function Date(props) {
  if (props.date) {
    return (
      <span>{ moment(props.date).format(props.format) }</span>
    );
  }
  return <span />;
}

Date.defaultProps = {
  format: DATE_FORMATS.DISPLAY,
};

Date.propTypes = {
  date: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  format: React.PropTypes.string,
};
