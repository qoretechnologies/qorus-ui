/* @flow */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';


const SystemInfo = ({ info }: { info: Object }) => (
  <ul>
    <li>
      <strong>Instance key:</strong> {info['instance-key']}
    </li>
    <li>
      <strong>Omq version:</strong> {info['omq-version']}
    </li>
    <li>
      <strong>Omq build:</strong> {info['omq-build']}
    </li>
    <li>
      <strong>Qore version:</strong> {info['qore-version']}
    </li>
  </ul>
);
SystemInfo.propTypes = {
  info: PropTypes.object.isRequired,
};

export default connect(
  state => ({ info: state.api.info.data })
)(SystemInfo);
