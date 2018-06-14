// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { ButtonGroup, Button, Intent } from '@blueprintjs/core';

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
}: Props): React.Element<any> =>
  scheduleOnly ? (
    <div>
      <span>{schedText}</span>{' '}
      <Button
        text="Reschedule"
        iconName="time"
        onClick={handleScheduleClick}
        className="pt-small"
      />
    </div>
  ) : (
    <ButtonGroup>
      <Button
        title={enabled ? 'Disable' : 'Enable'}
        iconName="power"
        intent={enabled ? Intent.SUCCESS : Intent.DANGER}
        onClick={handleEnableClick}
        className="pt-small"
      />
      <Button
        title={active ? 'Deactivate' : 'Activate'}
        iconName={active ? 'small-tick' : 'remove'}
        intent={active ? Intent.SUCCESS : Intent.DANGER}
        onClick={handleActivateClick}
        className="pt-small"
      />
      <Button
        title="Reset"
        iconName="refresh"
        onClick={handleResetClick}
        className="pt-small"
      />
      <Button
        title="Run"
        iconName="play"
        onClick={handleRunClick}
        className="pt-small"
      />
      <Button
        title="Reschedule"
        iconName="time"
        onClick={handleScheduleClick}
        className="pt-small"
      />
      <Button
        title="Set expiry"
        iconName="tag"
        onClick={handleExpiryClick}
        className="pt-small"
      />
    </ButtonGroup>
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
    handleEnableClick: ({
      enabled,
      action,
      id,
    }: Props): Function => (): void => {
      action(enabled ? 'disable' : 'enable', id);
    },
    handleActivateClick: ({
      active,
      activate,
      id,
    }: Props): Function => (): void => {
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
    handleExpiryClick: ({
      setExpiry,
      openModal,
      closeModal,
      id,
    }: Props): Function => (): void => {
      openModal(
        <SetExpiryModal onClose={closeModal} action={setExpiry} id={id} />
      );
    },
  }),
  pure(['enabled', 'active', 'id'])
)(ServiceControls);
