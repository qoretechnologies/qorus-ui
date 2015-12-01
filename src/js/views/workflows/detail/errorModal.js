import React, { Component, PropTypes } from 'react';


import Modal from 'components/modal';


import { pureRender } from 'components/utils';


@pureRender
export default class ErrorModal extends Component {
  static propTypes = {
    actionLabel: PropTypes.string.isRequired,
    error: PropTypes.object.isRequired,
    onCommit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      error: Object.assign({}, this.props.error)
    };
  }

  onCommit(ev) {
    ev.preventDefault();

    this.props.onCommit(this.state.error);
  }

  onChange(ev) {
    this.setState({
      error: Object.assign({}, this.state.error, {
        [ev.target.name]: ev.target.type !== 'checkbox' ?
          ev.target.value :
          ev.target.checked
      })
    });
  }

  render() {
    return (
      <Modal>
        <Modal.Header
          titleId='errorsTableModalLabel'
          onClose={this.props.onCancel.bind(this)}
        >
          {this.props.actionLabel} {this.state.error.error}
        </Modal.Header>
        <Modal.Body>
          <form
            className='form-horizontal'
            onSubmit={this.onCommit.bind(this)}
          >
            <div className='form-group'>
              <label
                htmlFor='cloneError'
                className='col-sm-3 control-label'
              >
                Email
              </label>
              <div className='col-sm-9'>
                <input
                  type='text'
                  className='form-control'
                  name='error'
                  id='cloneError'
                  value={this.state.error.error}
                  onChange={this.onChange.bind(this)}
                />
              </div>
            </div>
            <div className='form-group'>
              <label
                htmlFor='cloneSeverity'
                className='col-sm-3 control-label'
              >
                Severity
              </label>
              <div className='col-sm-9'>
                <input
                  type='text'
                  className='form-control'
                  name='severity'
                  id='cloneSeverity'
                  value={this.state.error.severity}
                  onChange={this.onChange.bind(this)}
                />
              </div>
            </div>
            <div className='form-group'>
              <label
                htmlFor='cloneRetry'
                className='col-sm-3 control-label'
              >
                Retry
              </label>
              <div className='col-sm-9 checkbox'>
                <input
                  type='checkbox'
                  name='retry_flag'
                  id='cloneRetry'
                  checked={this.state.error.retry_flag}
                  onChange={this.onChange.bind(this)}
                />
              </div>
            </div>
            <div className='form-group'>
              <label
                htmlFor='cloneDelay'
                className='col-sm-3 control-label'
              >
                Retry delay secs
              </label>
              <div className='col-sm-9'>
                <input
                  type='number'
                  className='form-control'
                  name='retry_delay_secs'
                  id='cloneDelay'
                  value={this.state.error.retry_delay_secs}
                  onChange={this.onChange.bind(this)}
                />
              </div>
            </div>
            <div className='form-group'>
              <label
                htmlFor='cloneBusiness'
                className='col-sm-3 control-label'
              >
                Business
              </label>
              <div className='col-sm-9 checkbox'>
                <input
                  type='checkbox'
                  name='business_flag'
                  id='cloneBusiness'
                  checked={this.state.error.business_flag}
                  onChange={this.onChange.bind(this)}
                />
              </div>
            </div>
            <div className='form-group'>
              <label
                htmlFor='cloneManual'
                className='col-sm-3 control-label'
              >
                Manually updated
              </label>
              <div className='col-sm-9 checkbox'>
                <input
                  type='checkbox'
                  name='manually_updated'
                  id='cloneManual'
                  checked={this.state.error.manually_updated}
                  onChange={this.onChange.bind(this)}
                />
              </div>
            </div>
            <div className='form-group'>
              <label
                htmlFor='cloneDescription'
                className='col-sm-3 control-label'
              >
                Description
              </label>
              <div className='col-sm-9'>
                <textarea
                  className='form-control'
                  name='description'
                  id='cloneDescription'
                  value={this.state.error.description}
                  onChange={this.onChange.bind(this)}
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className='btn btn-primary'
            onClick={this.onCommit.bind(this)}
          >
            {this.props.actionLabel}
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}
