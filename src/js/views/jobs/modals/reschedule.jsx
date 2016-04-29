import React, { Component } from 'react';

import Modal from 'components/modal';
import { normalizeName } from 'components/utils';

import { connect } from 'react-redux';
// import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';

import actions from 'store/api/actions';

@connect(
  null,
  dispatch => bindActionCreators({
    schedule: actions.jobs.reschedule,
  }, dispatch)
)
export default class ModalReschedule extends Component {
  static propTypes = {
    job: React.PropTypes.object.isRequired,
    onClose: React.PropTypes.func.isRequired,
    schedule: React.PropTypes.func,
  }

  validate = () => {}

  handleCancel = event => {
    event.preventDefault();
    this.props.onClose();
  }

  handleSubmit = event => {
    event.preventDefault();
    const values = ['minute', 'hour', 'day', 'month', 'wday'];

    const reschedule = values.reduce((r, v) => {
      const val = this.refs[v].value;
      r.push(val);
      return r;
    }, []);

    this.props.schedule(this.props.job, reschedule.join(' '));
    this.props.onClose();
  }

  next = ref => event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.refs[ref].focus();
    }
  }

  render() {
    const { job } = this.props;

    return (
      <Modal>
        <form onSubmit={ this.handleSubmit }>
          <Modal.Header
            onClose={this.handleCancel}
            titleId="jobReschedule"
          >
            Reschedule job { normalizeName(job, 'jobid') }
          </Modal.Header>
          <Modal.Body>
            <table className="table table--centered">
              <thead>
                <tr>
                  <th>Minutes</th>
                  <th>Hours</th>
                  <th>Days</th>
                  <th>Months</th>
                  <th>Weekdays</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ width: '20%' }}>
                    <input
                      type="text"
                      ref="minute"
                      id="minute"
                      defaultValue={ job.minute }
                      onKeyPress={ this.next('hour') }
                    />
                  </td>
                  <td style={{ width: '20%' }}>
                      <input
                        type="text"
                        ref="hour"
                        id="hour"
                        defaultValue={ job.hour }
                        onKeyPress={ this.next('day') }
                      />
                  </td>
                  <td style={{ width: '20%' }}>
                    <input
                      type="text"
                      ref="day"
                      id="day"
                      defaultValue={ job.day }
                      onKeyPress={ this.next('month') }
                    />
                  </td>
                  <td style={{ width: '20%' }}>
                    <input
                      type="text"
                      ref="month"
                      id="month"
                      defaultValue={ job.month }
                      onKeyPress={ this.next('wday') }
                    />
                  </td>
                  <td style={{ width: '20%' }}>
                    <input
                      type="text"
                      ref="wday"
                      id="wday"
                      defaultValue={ job.wday }
                      onKeyPress={ this.next('reschedule') }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-default" onClick={ this.handleCancel }>
              Cancel
            </button>
            <button ref="reschedule" className="btn btn-success" type="submit">
              Reschedule
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
