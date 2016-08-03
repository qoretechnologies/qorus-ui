import React, { PropTypes } from 'react';
import classNames from 'classnames';

import { statusHealth } from '../../../helpers/system';
import Loader from '../../../components/loader';
import Badge from '../../../components/badge';

export function SystemHealth({ health, className }) {
  if (!health.sync || health.loading) {
    return <Loader />;
  }

  const { ongoing, transient, ...data } = health.data;

  return (
    <div className={className}>
      <h4>System health</h4>
      <div className="health-info">
        <span
          className={ classNames('label', `label-${statusHealth(data.health)}`) }
        >
          { data.health }
        </span>
        {' '}
        <span>
          Ongoing
          {' '}
          <Badge
            val={ongoing}
            label={ongoing === 0 ? 'warning' : 'danger'}
          />
        </span>
        {' '}
        <span>
          Transient
          {' '}
          <Badge
            val={transient}
            label={transient === 0 ? 'warning' : 'danger'}
          />
        </span>
      </div>
    </div>
  );
}

SystemHealth.propTypes = {
  health: PropTypes.object.isRequired,
  className: PropTypes.string,
};
