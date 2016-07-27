/* @flow */
import React, { PropTypes } from 'react';

import showIfLoaded from '../../hocomponents/show-if-loaded';
import { statusHealth } from '../../helpers/system';
import Label from '../../components/label';
import { Health, HealthItem } from '../../components/health';

const LocalInfo = ({ health }: { health: Object }) => (
  <Health title="Local" className="local-health">
    <HealthItem title="Status">
      <Label
        style={statusHealth(health.data.health)}
      >
        {health.data.health}
      </Label>
    </HealthItem>
    <HealthItem title="Ongoing">{health.data.ongoing}</HealthItem>
    <HealthItem title="Transient">{health.data.transient}</HealthItem>
  </Health>
);
LocalInfo.propTypes = {
  health: PropTypes.object,
};

export default showIfLoaded('health')(LocalInfo);
