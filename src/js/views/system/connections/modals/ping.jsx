import React, { Component, PropTypes } from 'react';

import Modal from 'components/modal';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import actions from 'store/api/actions';

@connect(
  null,
  dispatch => bindActionCreators({
    schedule: actions.orders.reschedule,
  }, dispatch)
)
export default class extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    schedule: PropTypes.func,
    data: PropTypes.object,
  };

  componentWillMount() {
    this.setState({
      error: null,
    });
  }

  render() {
    return (
      <Modal>
        <Modal.Header
          onClose={this.props.onClose}
          titleId="system-connections-ping-modal"
        >
          Ping { this.model.name }
        </Modal.Header>
        <Modal.Body>
          Info table
        </Modal.Body>
      </Modal>
    );
  }
}
