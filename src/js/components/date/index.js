import React from 'react';
import moment from 'moment';

export default function Date(props) {
  if (props.date) {
    return (
      <span>{ moment(props.date).format(props.format) }</span>
    );
  }
  return <span />;
}

Date.defaultProps = {
  format: 'YYYY-MM-DD HH:mm:ss',
};

Date.propTypes = {
  date: React.PropTypes.string,
  format: React.PropTypes.string,
};
