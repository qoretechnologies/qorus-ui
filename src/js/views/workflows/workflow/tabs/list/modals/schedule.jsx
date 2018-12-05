// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import moment from 'moment';

import Modal from '../../../../../../components/modal';
import Datepicker from '../../../../../../components/datepicker';
import { DATE_FORMATS } from '../../../../../../constants/dates';
import actions from '../../../../../../store/api/actions';

type Props = {
  id: number,
  onClose: Function,
  action: Function,
  handleDateSelect: Function,
  status: string,
};

const Schedule: Function = ({
  onClose,
  handleDateSelect,
}: Props): React.Element<any> => (
  <Modal height={420}>
    <Modal.Header onClose={onClose} titleId="reschedule-modal">
      Reschedule order
    </Modal.Header>
    <Modal.Body>
      <Datepicker date="now" onApplyDate={handleDateSelect} futureOnly />
    </Modal.Body>
  </Modal>
);

export default compose(
  withHandlers({
    handleDateSelect: ({ action, id, status, onClose }: Props): Function => (
      date: Object
    ): void => {
      const formatedDate: string = moment(date, DATE_FORMATS.PROP).format(
        DATE_FORMATS.PROP
      );

      action(actions.orders.schedule, id, formatedDate, status);
      onClose();
    },
  }),
  pure(['workflowstatus'])
)(Schedule);
