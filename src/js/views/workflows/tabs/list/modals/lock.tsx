// @flow
import React, { Component } from 'react';

import Modal from '../../../../../components/modal';
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
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
  } = this.props;

  handleLockClick = () => {
    const { lock, id, username, locked, onClose } = this.props;

    lock(
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
      actions.orders.lock,
      id,
      username,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
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
          { /* @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'number'. */ }
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
