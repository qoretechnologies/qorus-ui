import React, { PropTypes } from 'react';

import Loader from '../../../components/loader';


function renderRemotes(remote) {
  return (
    <tr key={ remote.name }>
      <th>{ remote.name }</th>
      <td>{ remote.health }</td>
    </tr>
  );
}

export function SystemHealth(props) {
  const { health } = props;

  if (!health.sync || health.loading) {
    return <Loader />;
  }

  return (
    <div className={ props.className }>
      <h4>System health</h4>
      <div className="health col-md-8">
        <h6>Local</h6>
        <table className="table table-condensed">
          <tbody>
            <tr>
              <th>Status</th>
              <td>{ health.data.health }</td>
            </tr>
            <tr>
              <th>Ongoing</th>
              <td>{ health.data.ongoing }</td>
            </tr>
            <tr>
              <th>Transient</th>
              <td>{ health.data.transient }</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="health col-md-4">
        <h6>Remote</h6>
        <table className="table table-condensed">
          <tbody>
            { health.data.remote.map((r) => (renderRemotes(r))) }
          </tbody>
        </table>
      </div>

    </div>
  );
}

SystemHealth.propTypes = {
  health: PropTypes.object.isRequired,
  className: PropTypes.string,
};
