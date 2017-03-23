// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';

import { Controls, Control as Button } from '../../components/controls';
import withModal from '../../hocomponents/modal';
import actions from '../../store/api/actions';
import RescheduleModal from './modals/reschedule';
import SetExpiryModal from './modals/expiry';

type Props = {
  handleEnableClick: Function,
  handleActivateClick: Function,
  handleResetClick: Function,
  handleRunClick: Function,
  handleScheduleClick: Function,
  handleExpiryClick: Function,
  enabled?: boolean,
  active?: boolean,
  action: Function,
  schedule: Function,
  activate: Function,
  setExpiry: Function,
  id: number,
  openModal: Function,
  closeModal: Function,
  minute: string,
  hour: string,
  day: string,
  month: string,
  week: string,
  scheduleOnly?: boolean,
  schedText: string,
};

const ServiceControls: Function = ({
  handleEnableClick,
  handleActivateClick,
  handleResetClick,
  handleRunClick,
  handleScheduleClick,
  handleExpiryClick,
  active,
  enabled,
  scheduleOnly,
  schedText,
}: Props): React.Element<any> => (
  scheduleOnly ?
    <div>
      <span>{schedText}</span>
      {' '}
      <Button
        label="Reschedule"
        icon="clock-o"
        btnStyle="default"
        onClick={handleScheduleClick}
      />
    </div> :
    <Controls grouped>
      <Button
        title={enabled ? 'Disable' : 'Enable'}
        icon="power-off"
        btnStyle={enabled ? 'success' : 'danger'}
        onClick={handleEnableClick}
      />
      <Button
        title={active ? 'Deactivate' : 'Activate'}
        icon={active ? 'check' : 'ban'}
        btnStyle={active ? 'success' : 'danger'}
        onClick={handleActivateClick}
      />
      <Button
        title="Reset"
        icon="refresh"
        btnStyle="warning"
        onClick={handleResetClick}
      />
      <Button
        title="Run"
        icon="play"
        btnStyle="default"
        onClick={handleRunClick}
      />
      <Button
        title="Reschedule"
        icon="clock-o"
        btnStyle="default"
        onClick={handleScheduleClick}
      />
      <Button
        title="Set expiry"
        icon="tag"
        btnStyle="default"
        onClick={handleExpiryClick}
      />
    </Controls>
);

export default compose(
  connect(
    null,
    {
      action: actions.jobs.jobsAction,
      schedule: actions.jobs.reschedule,
      setExpiry: actions.jobs.expire,
      activate: actions.jobs.activate,
    }
  ),
  withModal(),
  withHandlers({
    handleEnableClick: ({ enabled, action, id }: Props): Function => (): void => {
      action(enabled ? 'disable' : 'enable', id);
    },
    handleActivateClick: ({ active, activate, id }: Props): Function => (): void => {
      activate(id, active);
    },
    handleRunClick: ({ action, id }: Props): Function => (): void => {
      action('run', id);
    },
    handleResetClick: ({ action, id }: Props): Function => (): void => {
      action('reset', id);
    },
    handleScheduleClick: ({
      schedule,
      openModal,
      closeModal,
      id,
      minute,
      hour,
      day,
      month,
      week,
    }: Props): Function => (): void => {
      openModal(
        <RescheduleModal
          onClose={closeModal}
          action={schedule}
          id={id}
          minute={minute}
          hour={hour}
          day={day}
          month={month}
          week={week}
        />
      );
    },
    handleExpiryClick: ({ setExpiry, openModal, closeModal, id }: Props): Function => (): void => {
      openModal(
        <SetExpiryModal
          onClose={closeModal}
          action={setExpiry}
          id={id}
        />
      );
    },
  }),
  pure([
    'enabled',
    'active',
    'id',
  ])
)(ServiceControls);
