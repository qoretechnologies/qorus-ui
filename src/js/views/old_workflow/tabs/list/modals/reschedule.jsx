import React, { Component, PropTypes } from 'react';

import { DATE_FORMATS } from 'constants/dates';

import Modal from 'components/modal';
import Datepicker from 'components/datepicker';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import actions from 'store/api/actions';

@connect(
  null,
  dispatch => bindActionCreators({
    schedule: actions.orders.schedule,
  }, dispatch)
)
export default class extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    schedule: PropTypes.func,
    data: PropTypes.object,
  };

  componentWillMount() {
    this.setState({
      error: null,
    });
  }

  reschedule = (d) => {
    if (moment().isBefore(d)) {
      const date = moment(d, DATE_FORMATS.PROP).format(DATE_FORMATS.PROP);

      this.props.schedule(this.props.data.id, date, this.props.data.workflowstatus);
      this.props.onClose();
    } else {
      this.setState({
        error: 'Cannot schedule to a date in past!',
      });
    }
  };

  render() {
    return (
      <Modal height={420}>
        <Modal.Header
          onClose={this.props.onClose}
          titleId="reschedule-modal"
        >
          Reschedule order
        </Modal.Header>
        <Modal.Body>
          {this.state.error &&
            <p className="text-danger">
              {this.state.error}
            </p>
          }
          <Datepicker
            date="now"
            onApplyDate={this.reschedule}
            futureOnly
          />
        </Modal.Body>
      </Modal>
    );
  }
}
