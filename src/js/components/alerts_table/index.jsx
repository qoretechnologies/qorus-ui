/* @flow */
import React from 'react';
import { Link } from 'react-router';

const AlertsTab = ({ alerts }: { alerts: Array<Object> }) => (
  <div>
    <h4> Alerts </h4>
    {alerts.length ? alerts.map(item => (
      <div key={`alert_${item.id}`} className="job-alert alerts-item">
        <Link to={`/system/alerts/${item.alerttype.toLowerCase()}?paneId=${item.type}:${item.id}`}>
          {item.alert}
        </Link>
        <p>{item.object}</p>
        <small>{item.reason}</small>
      </div>
    )) : (
      <p className="no-data"> No alerts found </p>
    )}
  </div>
);

export default AlertsTab;
