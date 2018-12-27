// @flow
import React, { Component } from 'react';

import Modal from '../../../../../components/modal';
import { Control as Button } from '../../../../../components/controls';
import ButtonGroup from '../../../../../components/controls/controls';
import actions from '../../../../../store/api/actions';
import Pull from '../../../../../components/Pull';

export default class extends Component {
  props: {
    onClose: Function,
    id: number,
    lock: Function,
    username: string,
    locked: boolean,
  };

  handleLockClick = () => {
    const { lock, id, username, locked, onClose } = this.props;

    lock(
      actions.orders.lock,
      id,
      username,
      this.refs.text.value,
      locked ? 'unlock' : 'lock'
    );
    onClose();
  };

  render() {
    return (
      <Modal hasFooter>
        <Modal.Header onClose={this.props.onClose} titleId="lock-modal">
          Reason
        </Modal.Header>
        <Modal.Body>
          <textarea ref="text" rows="12" className="form-control" />
        </Modal.Body>
        <Modal.Footer>
          <Pull right>
            <ButtonGroup>
              <Button
                big
                label="Cancel"
                action={this.props.onClose}
                btnStyle="default"
              />
              <Button
                big
                label="Save"
                action={this.handleLockClick}
                btnStyle="success"
              />
            </ButtonGroup>
          </Pull>
        </Modal.Footer>
      </Modal>
    );
  }
}
