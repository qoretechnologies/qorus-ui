import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Pane from '../../../components/pane';
import InfoTable from '../../../components/info_table';

const alertSelector = (state, props) =>
  (state.api.alerts.data.find(a => a.alertid === parseInt(props.params.id, 10)));

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
    location: PropTypes.object,
    router: PropTypes.object,
    route: PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  onClose = () => {
    const pathArr = this.props.location.pathname.split('/');
    const newPath = pathArr.slice(0, pathArr.length - 1).join('/');

    this.context.router.push(newPath);
  };

  render() {
    return (
      <Pane width={400} onClose={ this.onClose }>
        <h3>Alert detail</h3>
        <InfoTable object={ this.props.alert } />
        {/* <Table data={this.props.alert}>
          <Section type="body" data={ this.getData() } rows={this.renderRows} />
        </Table>*/}
      </Pane>
    );
  }
}
