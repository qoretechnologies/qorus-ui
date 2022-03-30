/* @flow */
import React, { Component } from 'react';
import find from 'lodash/find';

import Modal from '../../../../components/modal';
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
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
    // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    error: ?string,
  } = {
    error: null,
  };

  handleSaveClick: Function = (): void => {
    const { name, desc } = this.refs;

    if (
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
      name.value === '' ||
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
      desc.value === ''
    ) {
      this.setState({
        error: 'Please fill all fields marked with *',
      });
    } else if (
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
      !this.props.model && find(this.props.perms, { name: name.value })
    ) {
      this.setState({
        error: 'A permission with this name already exists.',
      });
    } else {
      this.props.onSave(
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
        name.value,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
        desc.value,
      );
    }
  };

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
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
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
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
                  // @ts-expect-error ts-migrate(2322) FIXME: Type 'Object' is not assignable to type 'boolean'.
                  readOnly={model}
                  ref="name"
                  type="text"
                  className="form-control"
                  id="name"
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
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
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'desc' does not exist on type 'Object'.
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
