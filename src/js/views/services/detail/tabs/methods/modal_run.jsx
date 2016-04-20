import React, { Component, PropTypes } from 'react';
import Modal from 'components/modal';
import Tabs, { Pane } from 'components/tabs';

import { fetchJson } from 'store/api/utils';
import yaml from 'js-yaml';

// import classNames from 'classnames';
import { pureRender } from 'components/utils';


@pureRender
export default class ModalRun extends Component {
  static propTypes = {
    method: PropTypes.object.isRequired,
    service: PropTypes.object.isRequired,
    response: PropTypes.object,
    onClose: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this._select = null;

    this.setState({
      activeMethod: this.props.method,
      response: false,
    });
  }

  handleCancel = (ev) => {
    ev.preventDefault();
    this.props.onClose();
  }

  handleCommit = (ev) => {
    const request = this._request.value;

    ev.preventDefault();

    // fetch()
    fetchJson(
      'PUT',
      `/api/services/${this.props.service.name}/${this.state.activeMethod.name}`,
      { body: JSON.stringify({ action: 'call', parse_args: request }) }
    ).then(response => { this.setState({ response, request }); });
  }

  handleMethodChange = (ev) => {
    this.setState({
      activeMethod: this.props.service.methods.find(m => m.name === ev.target.value),
    });
  }

  requestRef = (s) => {
    this._request = s;
  }

  selectRef = (s) => {
    this._select = s;
  }

  renderOptions() {
    const { service, method } = this.props;
    const { activeMethod } = this.state;

    return (
      <select
        name="method"
        id="method"
        defaultValue={method.name}
        value={activeMethod.name}
        onChange={this.handleMethodChange}
        ref={this.selectRef}
        className="form-control"
      >
        { service.methods.map((mtd, idx) => (
            <option value={mtd.name} key={idx}>
              { mtd.name }
            </option>
        ))}
      </select>
    );
  }

  /**
   * @return {ReactElement}
   */
  render() {
    const { response, request, activeMethod } = this.state;

    return (
      <Modal>
          <Modal.Header
            titleId="errorsTableModalLabel"
            onClose={this.handleCancel}
          >
            Method execution for {this.props.service.name} service
          </Modal.Header>
          <Modal.Body>
            <div className="content">
              <form
                onSubmit={this.handleCommit}
                noValidate
              >
                <div className="form-group">
                  <label htmlFor="method">Method</label>
                  { this.renderOptions() }
                </div>
                <p><em className="text-muted">{activeMethod.description}</em></p>
                <div>
                  <label htmlFor="args">Arguments</label>
                  <textarea
                    id="args"
                    name="args"
                    className="col-md-12 form-control"
                    rows="5"
                    ref={this.requestRef}
                    defaultValue={ request || '' }
                  />
                </div>
                <Tabs type="pills" navAtBottom>
                  <Pane name="yaml">
                    <textarea
                      id="response-yaml"
                      name="response-yaml"
                      className="col-md-12 form-control"
                      placeholder="Response"
                      readOnly
                      rows="5"
                      value={ (response) ? yaml.dump(response) : null}
                    />
                  </Pane>
                  <Pane name="json">
                    <textarea
                      id="response-json"
                      name="response-json"
                      className="col-md-12 form-control"
                      placeholder="Response"
                      readOnly
                      rows="5"
                      value={ (response) ? JSON.stringify(response, null, 4) : null}
                    />
                  </Pane>
                </Tabs>
              </form>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn"
              onClick={this.handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-success"
              onClick={this.handleCommit}
            >
              Call
            </button>
          </Modal.Footer>
      </Modal>
    );
  }
}
