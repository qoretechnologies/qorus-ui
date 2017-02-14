/* @flow */
import React, { PropTypes } from 'react';

const SystemInfo = ({ info }: { info: Object }) => (
  <div className="login-footer">
    <span>
      <strong>Schema information:</strong> {info['omq-schema']}
    </span>
    <span>
      <strong>Qorus version:</strong> {info['omq-version']}
    </span>
    <span>
      <strong>Qorus build:</strong> {info['omq-build']}
    </span>
    <span>
      <strong>Qore version:</strong> {info['qore-version']}
    </span>
  </div>
);
SystemInfo.propTypes = {
  info: PropTypes.object.isRequired,
};

export default SystemInfo;
