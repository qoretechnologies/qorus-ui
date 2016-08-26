import React, { Component, PropTypes } from 'react';

import { Controls, Control } from 'components/controls';
import Modal from 'components/modal';

export default class extends Component {
  static propTypes = {
    onMount: PropTypes.func,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    data: PropTypes.object,
  };

  handleFormSubmit = (event) => {
    event.preventDefault();

    const { domain, key, value } = this.refs;

    this.props.onSubmit({
      domain: domain.value,
      key: key.value,
      value: value.value,
    });

    this.props.onClose();
  };

  render() {
    const { data } = this.props;

    return (
      <Modal>
        <Modal.Header
          titleId="props-modal"
          onClose={this.props.onClose}
        >
          Create / Update property
        </Modal.Header>
        <form onSubmit={this.handleFormSubmit}>
          <Modal.Body>
            <div className="form-group">
              <label htmlFor="domain"> Domain </label>
              <input
                readOnly={data}
                ref="domain"
                type="text"
                id="domain"
                defaultValue={data ? data.domain : ''}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="key"> Key </label>
              <input
                readOnly={data}
                ref="key"
                type="text"
                id="key"
                defaultValue={data ? data.key : ''}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="value"> Value </label>
              <textarea
                ref="value"
                id="value"
                defaultValue={data ? data.value : ''}
                className="form-control"
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="pull-right">
              <Controls noControls grouped>
                <Control
                  label="Cancel"
                  big
                  btnStyle="default"
                  action={this.props.onClose}
                />
                <Control
                  type="submit"
                  big
                  label="Save"
                  btnStyle="success"
                />
              </Controls>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
