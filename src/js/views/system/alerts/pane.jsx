/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Pane from '../../../components/pane';
import InfoTable from '../../../components/info_table';

const alertSelector = (state, props) => (
  (state.api.alerts.data.find(a => a.alertid === parseInt(props.paneId, 10)))
);

const viewSelector = createSelector(
  [
    alertSelector,
  ],
  (alert) => ({
    alert,
  })
);

type Props = {
  alert: Object,
  onClose: Function,
  width: number
}

const AlertPane: Function = ({ alert, onClose, width }: Props) => (
  <Pane width={width} onClose={onClose}>
    <h3>Alert detail</h3>
    <InfoTable object={alert} />
  </Pane>
);

export default connect(viewSelector)(AlertPane);
