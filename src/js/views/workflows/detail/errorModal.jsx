import React, { Component, PropTypes } from 'react';
import Modal from 'components/modal';


import _ from 'lodash';
import classNames from 'classnames';
import { pureRender } from 'components/utils';


@pureRender
export default class ErrorModal extends Component {
  static propTypes = {
    actionLabel: PropTypes.string.isRequired,
    error: PropTypes.object.isRequired,
    onCommit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    requireChanges: PropTypes.bool
  };


  static defaultProps = {
    requireChanges: false
  };


  /**
   * @param {object} props
   */
  constructor(props) {
    super(props);

    this._form = null;

    this.state = {
      error: Object.assign({}, this.props.error),
      changes: null,
      status: {}
    };
  }


  /**
   * @param {Event} ev
   */
  onCommit(ev) {
    ev.preventDefault();

    if (this.validate()) {
      this.props.onCommit(this.state.error);
    }
  }


  /**
   * @param {Event} ev
   */
  onChange(ev) {
    this.setState({
      error: Object.assign({}, this.state.error, {
        [ev.target.name]: ev.target.type !== 'checkbox' ?
          ev.target.value :
          ev.target.checked
      })
    });
  }


  /**
   * @param {Event} ev
   */
  onBlur(ev) {
    this.validateElement(ev.target);

    if (this.state.changes === false) {
      this.validateChanges();
    }
  }


  /**
   * @return {boolean}
   */
  validate() {
    const els = this._form.querySelectorAll(
      '.form-group input, .form-group textarea'
    );
    for (let i = 0; i < els.length; i += 1) {
      if (!this.validateElement(els[i])) return false;
    }

    if (!this.validateChanges()) {
      return false;
    }

    return true;
  }


  /**
   * @param {Element} el
   * @return {boolean}
   */
  validateElement(el) {
    const status = Object.assign({}, this.state.status);

    if (el.checkValidity()) {
      delete status[el.id];
      this.setState({ status });
      return true;
    }

    if (el.validity.valueMissing) {
      status[el.id] = '(required value)';
    } else {
      status[el.id] = '(invalid value)';
    }
    this.setState({ status });

    return false;
  }


  /**
   * @return {boolean}
   */
  validateChanges() {
    if (!this.props.requireChanges) return true;

    const changes = !_.isEqual(this.props.error, this.state.error);
    this.setState({ changes });

    return changes;
  }


  /**
   * @return {ReactElement}
   */
  render() {
    const refForm = c => this._form = c;

    return (
      <Modal>
        <form
          className='form-horizontal'
          onSubmit={::this.onCommit}
          ref={refForm}
          noValidate
        >
          <Modal.Header
            titleId='errorsTableModalLabel'
            onClose={this.props.onCancel}
          >
            {this.props.actionLabel} {this.props.error.error}
          </Modal.Header>
          <Modal.Body>
            {this.state.changes === false && (
              <div className='alert alert-danger' role='alert'>
                You cannot submit this error without changes.
              </div>
            )}
            <div className='form-group'>
              <label
                htmlFor='modalError'
                className='col-sm-3 control-label'
              >
                Name
              </label>
              <div className='col-sm-9'>
                <input
                  type='text'
                  name='error'
                  id='modalError'
                  className='form-control'
                  value={this.state.error.error}
                  required
                  readOnly
                />
              </div>
            </div>
            <div
              className={classNames({
                'form-group': true,
                'has-error': this.state.status.modalSeverity
              })}
            >
              <label
                htmlFor='modalSeverity'
                className='col-sm-3 control-label'
              >
                Severity
              </label>
              <div className='col-sm-9'>
                <input
                  type='text'
                  name='severity'
                  id='modalSeverity'
                  className='form-control'
                  value={this.state.error.severity}
                  required
                  onChange={::this.onChange}
                  onBlur={::this.onBlur}
                  aria-invalid={this.state.status.modalSeverity && 'true'}
                  aria-describedby={this.state.status.modalSeverity &&
                                    'modalSeverityStatus'}
                />
                {this.state.status.modalSeverity && (
                  <span id='modalSeverityStatus' className='sr-only'>
                    {this.state.status.modalSeverity}
                  </span>
                )}
              </div>
            </div>
            <div className='form-group'>
              <label
                htmlFor='modalRetry'
                className='col-sm-3 control-label'
              >
                Retry
              </label>
              <div className='col-sm-9 checkbox'>
                <input
                  type='checkbox'
                  name='retry_flag'
                  id='modalRetry'
                  checked={this.state.error.retry_flag}
                  onChange={::this.onChange}
                />
              </div>
            </div>
            <div
              className={classNames({
                'form-group': true,
                'has-error': this.state.status.modalDelay
              })}
            >
              <label
                htmlFor='modalDelay'
                className='col-sm-3 control-label'
              >
                Retry delay secs
              </label>
              <div className='col-sm-9'>
                <input
                  type='number'
                  className='form-control'
                  name='retry_delay_secs'
                  id='modalDelay'
                  value={this.state.error.retry_delay_secs}
                  min='0'
                  onChange={::this.onChange}
                  onBlur={::this.onBlur}
                  aria-invalid={this.state.status.modalDelay && 'true'}
                  aria-describedby={this.state.status.modalDelay &&
                                    'modalDelayStatus'}
                />
                {this.state.status.modalDelay && (
                  <span id='modalDelayStatus' className='sr-only'>
                    {this.state.status.modalDelay}
                  </span>
                )}
              </div>
            </div>
            <div className='form-group'>
              <label
                htmlFor='modalBusiness'
                className='col-sm-3 control-label'
              >
                Business
              </label>
              <div className='col-sm-9 checkbox'>
                <input
                  type='checkbox'
                  name='business_flag'
                  id='modalBusiness'
                  checked={this.state.error.business_flag}
                  onChange={::this.onChange}
                />
              </div>
            </div>
            <div className='form-group'>
              <label
                htmlFor='modalManual'
                className='col-sm-3 control-label'
              >
                Manually updated
              </label>
              <div className='col-sm-9 checkbox'>
                <input
                  type='checkbox'
                  name='manually_updated'
                  id='modalManual'
                  checked={this.state.error.manually_updated}
                  onChange={::this.onChange}
                />
              </div>
            </div>
            <div
              className={classNames({
                'form-group': true,
                'has-error': this.state.status.modalDescription
              })}
            >
              <label
                htmlFor='modalDescription'
                className='col-sm-3 control-label'
              >
                Description
              </label>
              <div className='col-sm-9'>
                <textarea
                  name='description'
                  id='modalDescription'
                  className='form-control'
                  value={this.state.error.description}
                  required
                  onChange={::this.onChange}
                  onBlur={::this.onBlur}
                  aria-invalid={this.state.status.modalDescription && 'true'}
                  aria-describedby={this.state.status.modalDescription &&
                                    'modalDescriptionStatus'}
                />
                {this.state.status.modalDescription && (
                  <span id='modalDescriptionStatus' className='sr-only'>
                    {this.state.status.modalDescription}
                  </span>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type='submit'
              className='btn btn-primary'
            >
              {this.props.actionLabel}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
