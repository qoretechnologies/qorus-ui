import React, { Component, PropTypes } from 'react';

import Modal from 'components/modal';
import { Controls, Control } from 'components/controls';

export default class extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    steps: PropTypes.array,
  };

  componentWillMount() {
    this.setState({
      value: '',
      error: false,
    });
  }

  handleInputChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  handleFormSubmit = (event) => {
    event.preventDefault();

    let corr = true;
    const vals = this.state.value.split(',');
    const regexVal = /^[0-9]+$/;
    const regexRange = /^[0-9]+-[0-9]+$/;

    vals.forEach(val => {
      if (!regexVal.test(val) && !regexRange.test(val)) {
        corr = false;
      }
    });

    if (corr) {
      this.props.onSubmit(this.state.value);

      this.props.onClose();
    }

    this.setState({
      error: !corr,
    });
  };

  render() {
    return (
      <Modal hasFooter>
        <Modal.Header
          titleId="skip-modal"
          onClose={this.props.onClose}
        > Skip step </Modal.Header>
        <form
          onSubmit={this.handleFormSubmit}
        >
          <Modal.Body>
            <input
              type="text"
              value={this.state.value}
              className={`form-control ${this.state.error ? 'form-error' : ''}`}
              onChange={this.handleInputChange}
            />
          </Modal.Body>
          <Modal.Footer>
            <Controls grouped noControls>
              <Control
                type="button"
                label="Cancel"
                big
                btnStyle="default"
                action={this.props.onClose}
              />
              <Control
                type="submit"
                label="Save"
                big
                btnStyle="success"
              />
            </Controls>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
