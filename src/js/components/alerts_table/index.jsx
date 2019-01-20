/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import size from 'lodash/size';

import PaneItem from '../pane_item';
import NoDataIf from '../NoDataIf';
import AlertsTableItem from './item';

const AlertsTab = ({ alerts }: { alerts: Array<Object> }) => (
  <PaneItem title="Alerts">
    <NoDataIf condition={size(alerts) === 0}>
      {() => (
        <div className="alerts-table">
          {alerts.map((item, index) => (
            <AlertsTableItem key={index} item={item} />
          ))}
        </div>
      )}
    </NoDataIf>
  </PaneItem>
);

export default pure(['alerts'])(AlertsTab);
