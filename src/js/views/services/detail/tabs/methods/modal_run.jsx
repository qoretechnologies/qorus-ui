import React, { Component, PropTypes } from 'react';
import yaml from 'js-yaml';

import Modal from '../../../../../components/modal';
import Tabs, { Pane } from '../../../../../components/tabs';
import Alert from '../../../../../components/alert';
import settings from '../../../../../settings';
import { fetchJson } from '../../../../../store/api/utils';
import { pureRender } from '../../../../../components/utils';


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
      error: null,
      requestHeight: null,
      responseHeight: null,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.error !== prevState.error) {
      this.handleModalResize();
    }
  }

  _request = null;
  _response = null;

  handleCancel = (ev) => {
    ev.preventDefault();
    this.props.onClose();
  };

  handleCommit = (ev) => {
    const request = this._request.value;
    const { service } = this.props;
    const { activeMethod } = this.state;

    ev.preventDefault();

    // fetch()
    fetchJson(
      'PUT',
      `${settings.REST_BASE_URL}/services/${service.name}/${activeMethod.name}`,
      { body: JSON.stringify({ action: 'call', parse_args: request }) },
      true
    ).
    then(response => {
      if (!response) {
        this.setState({
          error: 'Server returned null',
        });
      } else if (response.err && response.desc) {
        this.setState({
          error: response.desc,
        });
      } else {
        this.setState({
          response,
          request,
          error: null,
        });
      }
    });
  };

  handleMethodChange = (ev) => {
    this.setState({
      activeMethod: this.props.service.methods.find(m => m.name === ev.target.value),
    });
  };

  handleModalResize = () => {
    if (this._request && this._response) {
      const { height: formHeight } = document.
        querySelectorAll('.method-form')[0].getBoundingClientRect();
      const { height: bodyHeight } = document.
        querySelectorAll('.modal-body')[0].getBoundingClientRect();
      const difference = bodyHeight - formHeight;

      const { height: requestHeight } = this._request.getBoundingClientRect();
      const { height: responseHeight } = this._response.getBoundingClientRect();

      this.setState({
        requestHeight: requestHeight + (difference / 2) - 70,
        responseHeight: responseHeight + (difference / 2) - 70,
      });
    }
  };

  requestRef = (s) => {
    this._request = s;
  };

  selectRef = (s) => {
    this._select = s;
  };

  renderOptions() {
    const { service, method } = this.props;
    const { activeMethod } = this.state;

    return (
      <select
        name="method"
        id="method"
        value={activeMethod ? activeMethod.name : method.name}
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

  respRef = (el) => {
    if (el) {
      this._response = el;
    }
  }

  /**
   * @return {ReactElement}
   */
  render() {
    const { response, request, activeMethod, error } = this.state;

    return (
      <Modal
        hasFooter
        onResizeStop={this.handleModalResize}
      >
          <Modal.Header
            titleId="errorsTableModalLabel"
            onClose={this.handleCancel}
          >
            Method execution for {this.props.service.name} service
          </Modal.Header>
          <Modal.Body>
            <div className="content">
              { error && (
                <Alert bsStyle="danger">
                  <h4> Error occured </h4>
                  { error }
                </Alert>
              )}
              <form
                onSubmit={this.handleCommit}
                noValidate
                className="method-form"
              >
                <div className="form-group">
                  <label htmlFor="method">Method</label>
                  { this.renderOptions() }
                </div>
                <p><em className="text-muted">{activeMethod.description}</em></p>
                <div ref={this.textWrapRef}>
                  <div>
                    <label htmlFor="args">Arguments</label>
                    <textarea
                      id="args"
                      name="args"
                      className="col-md-12 form-control"
                      rows="5"
                      ref={this.requestRef}
                      defaultValue={ request || '' }
                      style={{
                        height: this.state.requestHeight || 'auto',
                      }}
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
                        ref={this.respRef}
                        value={ (response) ? yaml.dump(response) : ''}
                        style={{
                          height: this.state.responseHeight || 'auto',
                        }}
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
                        value={ (response) ? JSON.stringify(response, null, 4) : ''}
                        style={{
                          height: this.state.responseHeight || 'auto',
                        }}
                      />
                    </Pane>
                  </Tabs>
                </div>
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
