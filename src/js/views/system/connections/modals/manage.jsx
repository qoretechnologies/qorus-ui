// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from '../../../../components/modal';
import Alert from '../../../../components/alert';
import { Controls, Control as Button } from '../../../../components/controls';
import actions from '../../../../store/api/actions';

type Props = {
  onClose: Function,
  edit?: boolean,
  remoteType: string,
  handleFormSubmit: Function,
  handleSaveClick: Function,
  user: string,
  type: string,
  pass: string,
};

class ManageModal extends Component {
  props: Props;

  handleFormSubmit: Function = (event: EventHandler): void => {
    event.preventDefault();
  }

  handleSaveClick: Function = (): void => {

  };

  render() {
    const {
      onClose,
      edit,
      remoteType,
      user,
      type,
      pass,
    } = this.props;

    return (
      <Modal>
        <Modal.Header
          titleId="manage"
          onClose={onClose}
        >
          { edit ? 'Edit connection' : 'Add connection'}
        </Modal.Header>
        <form
          onSubmit={this.handleFormSubmit}
          className="form-horizontal"
        >
          {remoteType === 'datasources' && (
            <Modal.Body>
              <div className="form-group">
                <label className="col-lg-4 control-label" htmlFor="type">Type *</label>
                <div className="col-lg-6">
                  <input
                    type="text"
                    name="type"
                    id="type"
                    className="form-control"
                    defaultValue={type}
                    ref="type"
                    required="required"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-lg-4 control-label" htmlFor="usr">User *</label>
                <div className="col-lg-6">
                  <input
                    type="text"
                    name="usr"
                    id="usr"
                    autoComplete="off"
                    className="form-control"
                    defaultValue={user}
                    ref="user"
                    required="required"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-lg-4 control-label" htmlFor="pwd">Password *</label>
                <div className="col-lg-6">
                  <input
                    type="password"
                    name="pwd"
                    id="pwd"
                    autoComplete="off"
                    className="form-control"
                    ref="pass"
                    required="required"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-lg-4 control-label" htmlFor="db">DB *</label>
                <div className="col-lg-6">
                  <input
                    type="text"
                    name="db"
                    id="db"
                    autoComplete="off"
                    className="form-control"
                    ref="db"
                    required="required"
                  />
                </div>
              </div>
            </Modal.Body>
          )}
          <Modal.Footer>
            <Controls noControls grouped>
              <Button
                big
                btnStyle="default"
                label="Cancel"
                onClick={onClose}
              />
              <Button
                big
                btnStyle="success"
                label="Save"
                onClick={this.handleSaveClick}
              />
            </Controls>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

export default ManageModal;
