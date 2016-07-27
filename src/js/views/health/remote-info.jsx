/* @flow */
import React, { PropTypes } from 'react';

import showIfLoaded from '../../hocomponents/show-if-loaded';
import { statusHealth } from '../../helpers/system';
import Label from '../../components/label';
import { Health, HealthItem } from '../../components/health';

const RemoteInfo = ({ health }: { health: Object }) => (
  <Health title="Remote" className="remote-health">
    {health.data.remote.map(item => (
      <HealthItem key={`health-item-${item.name}`} title={item.name}>
        <Label
          style={statusHealth(item.health)}
        >
          {item.health}
        </Label>
      </HealthItem>
    ))}
  </Health>
);
RemoteInfo.propTypes = {
  health: PropTypes.object,
};

export default showIfLoaded('health')(RemoteInfo);
