/* @flow */

const SystemInfo = ({ info }: { info: any }) => (
  <div className="login-footer">
    <span>
      <strong>Qorus Integration Engine:</strong> {info['edition']} Edition
    </span>
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

export default SystemInfo;
