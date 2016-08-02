import React, { PropTypes } from 'react';
import classNames from 'classnames';

import { statusHealth } from '../../../helpers/system';
import Loader from '../../../components/loader';

export function SystemHealth(props) {
  const { health } = props;

  if (!health.sync || health.loading) {
    return <Loader />;
  }

  const healthStatus = health.data.health;

  return (
    <div className={ props.className }>
      <h4>System health</h4>
      <div>
        <span
          className={ classNames('label', `label-${statusHealth(healthStatus)}`) }
        >
          { healthStatus }
        </span>
      </div>
    </div>
  );
}

SystemHealth.propTypes = {
  health: PropTypes.object.isRequired,
  className: PropTypes.string,
};
