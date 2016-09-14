/* @flow */
import React from 'react';
import { Link } from 'react-router';

const AlertsTab = ({ alerts }: { alerts: Array<Object> }) => (
  <div>
    {alerts.length === 0 && (<p className="no-data">no-data</p>)}
    {alerts.length > 0 && alerts.map(item => (
      <div key={`alert_${item.id}`} className="job-alert">
        <Link to={`/system/alerts/${item.alerttype.toLowerCase()}/${item.alertid}`}>
          {item.alert}
        </Link>
        <p>{item.object}</p>
        <small>{item.reason}</small>
      </div>
    ))}
  </div>
);

export default AlertsTab;
