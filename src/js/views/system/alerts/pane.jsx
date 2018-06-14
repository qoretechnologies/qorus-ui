/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Link } from 'react-router';

import Pane from '../../../components/pane';
import InfoTable from '../../../components/info_table';
import Box from '../../../components/box';
import Container from '../../../components/container';
import { getAlertObjectLink } from '../../../helpers/system';

const alertSelector = (state, props) => {
  const dt = props.paneId.split(':');

  return state.api.alerts.data.find(
    a => a.type === dt[0] && (a.id === parseInt(dt[1], 10) || a.id === dt[1])
  );
};

const viewSelector = createSelector([alertSelector], alert => ({
  alert,
}));

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
      <Box top>
        <Container fill>
          {alert.type !== 'RBAC' &&
            !(alert.type === 'GROUP' && alert.id < 1) && (
              <p>
                Related object:{' '}
                <Link
                  className="alert-pane-object"
                  to={getAlertObjectLink(alert.type, alert)}
                >
                  {alert.version &&
                    `${alert.name} v${alert.version} (${alert.id})`}
                  {!alert.version && `${alert.name}`}
                </Link>
              </p>
            )}
          <InfoTable object={alert} omit={['object', '_updated']} />
        </Container>
      </Box>
    </Pane>
  );
};

export default connect(viewSelector)(AlertPane);
