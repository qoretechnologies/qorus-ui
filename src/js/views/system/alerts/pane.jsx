import React, { Component, PropTypes } from 'react';

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

@connect(viewSelector)
export default class AlertPane extends Component {
  static propTypes = {
    alert: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    width: PropTypes.number,
  };

  render() {
    return (
      <Pane width={this.props.width} onClose={this.props.onClose}>
        <h3>Alert detail</h3>
        <InfoTable object={ this.props.alert } />
      </Pane>
    );
  }
}
