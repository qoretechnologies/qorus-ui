/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import size from 'lodash/size';

import PaneItem from '../pane_item';
import NoDataIf from '../NoDataIf';
import AlertsTableItem from './item';
import { injectIntl } from 'react-intl';

const AlertsTab = ({
  alerts,
  noTag,
  title,
  intl,
}: {
  alerts: Array<Object>,
  noTag: boolean,
  title: string,
  intl: any,
}) => (
  <PaneItem title={title || intl.formatMessage({ id: 'component.alerts' })}>
    <NoDataIf condition={size(alerts) === 0}>
      {() => (
        <div className="alerts-table">
          {alerts.map((item, index) => (
            <AlertsTableItem key={index} item={item} noTag={noTag} />
          ))}
        </div>
      )}
    </NoDataIf>
  </PaneItem>
);

export default compose(
  pure(['alerts']),
  injectIntl
)(AlertsTab);
