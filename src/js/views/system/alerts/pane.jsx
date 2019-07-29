/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Pane from '../../../components/pane';
import InfoTable from '../../../components/info_table';
import Box from '../../../components/box';
import { getAlertObjectLink } from '../../../helpers/system';
import InterfaceTag from '../../../components/InterfaceTag';
import Toolbar from '../../../components/toolbar';
import AlertsTable from '../../../components/alerts_table';
import PaneItem from '../../../components/pane_item';

const alertSelector = (state, props) => {
  return state.api.alerts.data.find(
    a => a.alertid === parseInt(props.paneId, 10)
  );
};

const viewSelector = createSelector(
  [alertSelector],
  alert => ({
    alert,
  })
);

type Props = {
  alert: Object,
  onClose: Function,
  width: number,
  onResize: Function,
};

const AlertPane: Function = ({ width, onResize, alert, onClose }: Props) => {
  if (!alert) {
    onClose();

    return null;
  }

  return (
    <Pane
      width={width || 550}
      onClose={onClose}
      onResize={onResize}
      title="Alert detail"
    >
      <Box top fill scrollY>
        {alert.type !== 'RBAC' && !(alert.type === 'GROUP' && alert.id < 1) && (
          <Toolbar mb>
            <InterfaceTag
              flex="0 1 auto"
              type={alert.type}
              link={getAlertObjectLink(alert.type, alert)}
              title={alert.name}
            />
          </Toolbar>
        )}
        <AlertsTable alerts={[alert]} noTag title="Reason" />
        <PaneItem title="Info">
          <InfoTable object={alert} omit={['object', '_updated', 'reason']} />
        </PaneItem>
      </Box>
    </Pane>
  );
};

export default connect(viewSelector)(AlertPane);
