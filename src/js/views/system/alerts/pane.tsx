/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import AlertsTable from '../../../components/alerts_table';
import Box from '../../../components/box';
import InfoTable from '../../../components/info_table';
import InterfaceTag from '../../../components/InterfaceTag';
import Pane from '../../../components/pane';
import PaneItem from '../../../components/pane_item';
import Toolbar from '../../../components/toolbar';
import { getAlertObjectLink } from '../../../helpers/system';

const alertSelector = (state, props) => {
  return state.api.alerts.data.find((a) => a.alertid === parseInt(props.paneId, 10));
};

const viewSelector = createSelector([alertSelector], (alert) => ({
  alert,
}));

type Props = {
  alert: any;
  onClose: Function;
  width: number;
  onResize: Function;
};

const AlertPane: Function = ({ width, onResize, alert, onClose }: Props) => {
  if (!alert) {
    onClose();

    return null;
  }

  return (
    <Pane width={width || 550} onClose={onClose} onResize={onResize} title="Alert detail">
      <Box top fill scrollY>
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'. */}
        {alert.type !== 'RBAC' && !(alert.type === 'GROUP' && alert.id < 1) && (
          <Toolbar mb>
            <InterfaceTag
              flex="0 1 auto"
              // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
              type={alert.type}
              // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
              link={getAlertObjectLink(alert.type, alert)}
              // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
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
