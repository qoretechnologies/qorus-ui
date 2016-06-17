import React, { PropTypes } from 'react';

import Log from '../../../components/log';

export default function LogsLog(props) {
  return (
    <Log resource={ props.params.log } />
  );
}

LogsLog.propTypes = {
  params: PropTypes.object.isRequired,
};
