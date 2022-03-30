// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import Modal from '../../../components/modal';
import Datepicker from '../../../components/datepicker';
import withDispatch from '../../../hocomponents/withDispatch';
import withHandlers from 'recompose/withHandlers';
import moment from 'moment';
import { DATE_FORMATS } from '../../../constants/dates';
import actions from '../../../store/api/actions';

type Props = {
  id: number,
  onClose: Function,
  handleExpiryChange: Function,
  expiry: string,
};

const Schedule: Function = ({
  id,
  expiry,
  onClose,
  handleExpiryChange,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <Modal>
    <Modal.Header onClose={onClose} titleId="reschedule-modal">
      Set expiration date for a job
    </Modal.Header>
    <Modal.Body>
      <Datepicker
        date={expiry}
        onApplyDate={(date: string) => {
          handleExpiryChange(date, id, onClose);
        }}
        futureOnly
      />
    </Modal.Body>
  </Modal>
);

export default compose(
  withDispatch(),
  withHandlers({
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatchAction' does not exist on type '... Remove this comment to see the full error message
    handleExpiryChange: ({ dispatchAction }: Props): Function => (
      date: Object,
      id: number,
      onClose: Function
    ): void => {
      const formatedDate: string = moment(date, DATE_FORMATS.PROP).format(
        DATE_FORMATS.PROP
      );

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
      dispatchAction(actions.jobs.expire, id, formatedDate, onClose);
    },
  }),
  pure(['id', 'expiry'])
)(Schedule);
