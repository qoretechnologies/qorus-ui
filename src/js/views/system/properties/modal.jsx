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

  componentWillMount() {
    const domain = this.props.data.domain || '';
    const key = this.props.data.key || '';
    const value = this.props.data.value || '';

    this.setState({
      domain,
      key,
      value,
    });
  }

  handleInputChange = (input) => (event) => {
    this.setState({
      [input]: event.target.value,
    });
  };

  handleFormSubmit = (event) => {
    event.preventDefault();

    this.props.onSubmit(this.state);
    this.props.onClose();
  };

  render() {
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
                type="text"
                id="domain"
                onChange={this.handleInputChange('domain')}
                defaultValue={this.state.domain}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="key"> Key </label>
              <input
                type="text"
                id="key"
                onChange={this.handleInputChange('key')}
                defaultValue={this.state.key}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="value"> Value </label>
              <textarea
                id="value"
                onChange={this.handleInputChange('value')}
                defaultValue={this.state.value}
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
