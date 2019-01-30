/* @flow */
import React, { Component } from 'react';
import find from 'lodash/find';

import Modal from '../../../../components/modal';
import { Controls, Control as Button } from '../../../../components/controls';
import Alert from '../../../../components/alert';

export default class AddRoleModal extends Component {
  props:{
    onClose: Function,
    onSave: Function,
    model?: Object,
    title: string,
    perms: Array<string>,
  } = this.props;

  state: {
    error: ?string,
  } = {
    error: null,
  };

  handleSaveClick: Function = (): void => {
    const { name, desc } = this.refs;

    if (
      name.value === '' ||
      desc.value === ''
    ) {
      this.setState({
        error: 'Please fill all fields marked with *',
      });
    } else if (
      !this.props.model && find(this.props.perms, { name: name.value })
    ) {
      this.setState({
        error: 'A permission with this name already exists.',
      });
    } else {
      this.props.onSave(
        name.value,
        desc.value,
      );
    }
  };

  handleFormSubmit: Function = (event: EventHandler): void => {
    event.preventDefault();

    this.handleSaveClick();
  };

  render() {
    const { model, onClose } = this.props;

    return (
      <Modal hasFooter>
        <Modal.Header
          titleId="addUserModal"
          onClose={onClose}
        >{ this.props.title }</Modal.Header>
        <form
          className="form-horizontal"
          onSubmit={this.handleFormSubmit}
        >
          <Modal.Body>
            { this.state.error && (
              <Alert bsStyle="danger">{ this.state.error }</Alert>
            )}
            <div className="form-group">
              <label htmlFor="name" className="col-sm-4 control-label">Permission name *</label>
              <div className="col-sm-6">
                <input
                  readOnly={model}
                  ref="name"
                  type="text"
                  className="form-control"
                  id="name"
                  defaultValue={model ? model.name : ''}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="desc" className="col-sm-4 control-label">Description *</label>
              <div className="col-sm-6">
                <textarea
                  ref="desc"
                  className="form-control"
                  id="desc"
                  defaultValue={model ? model.desc : ''}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Controls noControls grouped>
              <Button
                label="Cancel"
                big
                btnStyle="default"
                action={onClose}
                type="button"
              />
              <Button
                label="Save"
                big
                btnStyle="success"
                type="submit"
              />
            </Controls>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
