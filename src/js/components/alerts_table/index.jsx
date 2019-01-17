/* @flow */
import React from 'react';
import { Link } from 'react-router';
import pure from 'recompose/onlyUpdateForKeys';

import NoData from '../nodata';
import PaneItem from '../pane_item';

const AlertsTab = ({ alerts }: { alerts: Array<Object> }) => (
  <PaneItem title="Alerts">
    {alerts.length ? (
      alerts.map(item => (
        <div key={`alert_${item.alertid}`} className="job-alert alerts-item">
          <Link
            to={`/system/alerts?tab=${item.alerttype.toLowerCase()}&paneId=${
              item.type
            }:${item.id}`}
          >
            {item.alert}
          </Link>
          <p>{item.object}</p>
          <div style={{ whiteSpace: 'pre-wrap' }}>{item.reason}</div>
        </div>
      ))
    ) : (
      <NoData />
    )}
  </PaneItem>
);

export default pure(['alerts'])(AlertsTab);
