/* @flow */
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import withProps from 'recompose/withProps';

import { DATE_FORMATS } from '../../../constants/dates.js';
import { formatDate } from '../../../helpers/date';
import { Control } from '../../../components/controls';
import Modal from '../../../components/modal';
import DatePicker from '../../../components/datepicker';
import { normalizeName } from '../../../components/utils';
import actions from '../../../store/api/actions';


const ModalExpiry = ({
  job,
  date,
  setDate,
  handleSubmit,
  handleClear,
  handleCancel,
}: {
  job: Object,
  date: string,
  setDate: Function,
  handleSubmit: Function,
  handleClear: Function,
  handleCancel: Function,
}) => (
  <form onSubmit={handleSubmit} className="expire-date-form">
    <Modal hasFooter height={500}>
      <Modal.Header
        onClose={handleCancel}
        titleId="jobExpiration"
      >
        Set expiration for job { normalizeName(job, 'jobid') }
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <label className="sr-only" htmlFor="date">Set expiration date</label>
          <DatePicker onApplyDate={setDate} date={date} applyOnBlur futureOnly />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Control onClick={handleCancel} btnStyle="default" label="Cancel" big />
        <Control onClick={handleClear} btnStyle="default" label="Clear" big />
        <Control type="submit" btnStyle="success" label="Set expiry" big />
      </Modal.Footer>
    </Modal>
  </form>
);

const addDateState = withState('date', 'setDate', '');

const setExpireDateFromJob = withProps(
  ({ job, date }: { job: Object, date: string }): Object => ({
    date: date || job.expiry_date && moment(job.expiry_date).format(DATE_FORMATS.URL_FORMAT) || '',
  })
);

const addSubmitHandler = withHandlers({
  handleSubmit: (
    {
      job,
      date,
      expire,
      onClose,
    }: {
      job: Object,
      date: string,
      expire: Function,
      onClose: Function,
    }
  ) => (e: Object) => {
    e.preventDefault();
    expire(job, formatDate(date).format());
    onClose();
  },
});

const addClearHandler = withHandlers({
  handleClear: (
    {
      job,
      expire,
      onClose,
    }: {
      job: Object,
      expire: Function,
      onClose: Function,
    }
  ) => () => {
    expire(job, '');
    onClose();
  },
});

const addCancelHandler = withHandlers({
  handleCancel: ({ onClose }: { onClose: Function }) => (e: Object) => {
    e.preventDefault();
    onClose();
  },
});


export default compose(
  connect(
    () => ({}),
    { expire: actions.jobs.setExpirationDate }
  ),
  addDateState,
  setExpireDateFromJob,
  addSubmitHandler,
  addClearHandler,
  addCancelHandler,
)(ModalExpiry);
