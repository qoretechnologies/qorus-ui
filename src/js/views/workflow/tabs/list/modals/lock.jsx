import React, { Component, PropTypes } from 'react';
import Modal from 'components/modal';
import { Control as Button } from 'components/controls';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import actions from 'store/api/actions';

@connect(
  null,
  dispatch => bindActionCreators({
    lock: actions.orders.lock,
    unlock: actions.orders.unlock,
  }, dispatch)
)
export default class extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    lock: PropTypes.func,
    unlock: PropTypes.func,
    data: PropTypes.object,
    label: PropTypes.string,
    username: PropTypes.string,
  };

  componentWillMount() {
    this.setState({
      value: '',
    });
  }

  handleTextChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  handleLockClick = () => {
    if (this.props.data.operator_lock) {
      this.props.unlock(this.props.data, this.state.value, this.props.username);
    } else {
      this.props.lock(this.props.data, this.state.value, this.props.username);
    }

    this.props.onClose();
  };

  render() {
    return (
      <Modal hasFooter>
        <Modal.Header
          onClose={this.props.onClose}
          titleId="lock-modal"
        >
          Reason
        </Modal.Header>
        <Modal.Body>
          <textarea
            rows="12"
            className="form-control"
            onChange={this.handleTextChange}
            value={this.state.value}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="pull-right">
            <Button
              big
              label="Cancel"
              action={this.props.onClose}
              btnStyle="default"
            />
            <Button
              big
              label={this.props.label}
              action={this.handleLockClick}
              btnStyle="success"
            />
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
}
