import React, { Component, PropTypes } from 'react';
import Modal from 'components/modal';

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
    ev.preventDefault();

    this.props.onClose();
  }

  handleMethodChange = () => {
    this.setState({
      activeMethod: this._select.value,
    });
  }

  selectRef = (s) => {
    this._select = s;
  }

  renderOptions() {
    const { service } = this.props;
    const { activeMethod } = this.state;

    return (
      <select
        name="method"
        id="method"
        defaultValue={activeMethod.name}
        onChange={this.handleMethodChange}
        ref={this.selectRef}
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
    const { response } = this.state;

    return (
      <Modal>
        <form
          className="form-horizontal"
          onSubmit={this.handleCommit}
          noValidate
        >
          <Modal.Header
            titleId="errorsTableModalLabel"
            onClose={this.handleCancel}
          >
            Method execution for {this.props.service.name} service
          </Modal.Header>
          <Modal.Body>
            <div className="content">
              <p><em className="text-muted">{this.props.method.description}</em></p>
              <label htmlFor="method">Method</label>
                { this.renderOptions() }
              <div>
                <p><label htmlFor="args">Arguments</label></p>
                <textarea id="args" name="args" className="col-md-12" rows="5" />
              </div>
              <div id="service-method-response">
                <div className="tab-content">
                  <div id="service-method-response-yaml" className="tab-pane active">
                    <textarea
                      id="response-json"
                      name="response-json"
                      className="col-md-12"
                      disabled
                      rows="5"
                      defaultValue={ response || 'Response' }
                    />
                  </div>
                  <div id="service-method-response-json" className="tab-pane">
                    <textarea
                      id="response-json"
                      name="response-json"
                      className="col-md-12"
                      disabled
                      rows="5"
                      defaultValue={ response || 'Response' }
                    />
                  </div>
                </div>
                <ul className="nav nav-pills">
                  <li className="active">
                    <a data-target="#service-method-response-yaml">YAML</a>
                  </li>
                  <li><a data-target="#service-method-response-json">JSON</a></li>
                </ul>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="submit"
              className="btn btn-success"
              onClick={this.handleCommit}
            >
              Execute
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
