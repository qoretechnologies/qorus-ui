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

  handleSkipClick = () => {
    this.skipStep(true);
  };

  handleSkipRetryClick = () => {
    this.skipStep(false);
  }

  handleFormSubmit = (event) => {
    event.preventDefault();
  };

  skipStep = (type) => {
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
      this.props.onSubmit(this.state.value, type);

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
            <p> You can skip a step using: </p>
            <p> - individual step indexes separated by comma (1, 2, 3)</p>
            <p> - index ranges (1, 3, 5-10)</p>
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
                label="Skip"
                big
                btnStyle="success"
                onClick={this.handleSkipClick}
              />
              <Control
                type="submit"
                label="Skip & Retry"
                big
                btnStyle="success"
                onClick={this.handleSkipRetryClick}
              />
            </Controls>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
