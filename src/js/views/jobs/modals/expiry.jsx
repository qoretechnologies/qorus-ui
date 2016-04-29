import React, { Component, PropTypes } from 'react';

import Modal from 'components/modal';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import { normalizeName } from 'components/utils';

import actions from 'store/api/actions';

@connect(
  null,
  dispatch => bindActionCreators({
    expire: actions.jobs.setExpiration,
  }, dispatch)
)
export default class ModalExpiry extends Component {
  static propTypes = {
    job: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    expire: PropTypes.func.isRequired,
  }

  handleCancel = event => {
    event.preventDefault();
    this.props.onClose(event);
  }

  handleSubmit = event => {
    event.preventDefault();

    this.props.expire(this.props.job, moment(this.refs.date).format());

    this.props.onClose();
  }

  render() {
    const { job } = this.props;

    return (
      <Modal>
        <form onSubmit={this.handleSubmit}>
          <Modal.Header
            onClose={ this.handleCancel }
            titleId="jobExpiration"
          >
            Set expiration for job { normalizeName(job, 'jobid') }
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label className="sr-only" htmlFor="date">Set expiration date</label>
              <div className="input-group">
                <div className="input-group-addon"><i className="fa fa-calendar" /></div>
                <input type="text" className="form-control" ref="date" id="date" />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <btn className="btn" onClick={this.handleCancel}>Cancel</btn>
            <btn className="btn btn-success" type="submit">Set expiry</btn>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
