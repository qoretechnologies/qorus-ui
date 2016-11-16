/* @flow */
import React from 'react';
import { Link } from 'react-router';

import checkNoData from '../../hocomponents/check-no-data';

const AlertsTab = ({ alerts }: { alerts: Array<Object> }) => (
  <div>
    {alerts.map(item => (
      <div key={`alert_${item.id}`} className="job-alert alerts-item">
        <Link to={`/system/alerts/${item.alerttype.toLowerCase()}?paneId=${item.alertid}`}>
          {item.alert}
        </Link>
        <p>{item.object}</p>
        <small>{item.reason}</small>
      </div>
    ))}
  </div>
);

export default checkNoData(
  ({ alerts }: { alerts: Object }): boolean => (alerts.length > 0),
)(AlertsTab);
