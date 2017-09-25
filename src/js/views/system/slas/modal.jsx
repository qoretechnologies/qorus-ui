// @flow
import React, { Component } from 'react';
import Modal from '../../../components/modal';

import { Controls, Control as Button } from '../../../components/controls';

type Props = {
  onClose: Function,
  onSubmit: Function,
};

export default class SLACreateModal extends Component {
  props: Props;

  handleFormSubmit: Function = (event: Object): void => {
    event.preventDefault();

    const { form, name, desc } = this.refs;

    this.props.onSubmit(
      name.value,
      desc.value,
      form.units.value,
    );
    this.props.onClose();
  };

  render() {
    return (
      <form
        className="form-horizontal"
        onSubmit={this.handleFormSubmit}
        ref="form"
      >
        <Modal hasFooter>
          <Modal.Header
            titleId="slacreate"
            onClose={this.props.onClose}
          >
            Create new SLA
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label htmlFor="name" className="col-sm-4 control-label">Name *</label>
              <div className="col-sm-6">
                <input
                  ref="name"
                  type="text"
                  className="form-control"
                  id="name"
                  required="required"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="desc" className="col-sm-4 control-label">Description *</label>
              <div className="col-sm-6">
                <input
                  ref="desc"
                  type="text"
                  className="form-control"
                  id="desc"
                  required="required"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="type" className="col-sm-4 control-label">Units *</label>
              <div className="col-sm-6">
                <label>
                  <input
                    name="units"
                    type="radio"
                    value="seconds"
                    required="required"
                  />
                  {' '}
                  Seconds
                </label>
                {' '}
                <label>
                  <input
                    name="units"
                    type="radio"
                    value="other"
                    required="required"
                  />
                  {' '}
                  Other
                </label>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="pull-right">
              <Controls noControls grouped>
                <Button
                  label="Cancel"
                  big
                  btnStyle="default"
                  onClick={this.props.onClose}
                />
                <Button
                  label="Submit"
                  big
                  btnStyle="success"
                  type="submit"
                />
              </Controls>
            </div>
          </Modal.Footer>
        </Modal>
      </form>
    );
  }
}
