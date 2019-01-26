// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { Intent } from '@blueprintjs/core';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../components/controls';

import withModal from '../../hocomponents/modal';
import actions from '../../store/api/actions';
import RescheduleModal from './modals/reschedule';
import SetExpiryModal from './modals/expiry';
import withDispatch from '../../hocomponents/withDispatch';

type Props = {
  handleEnableClick: Function,
  handleActivateClick: Function,
  handleResetClick: Function,
  handleRunClick: Function,
  handleScheduleClick: Function,
  handleExpiryClick: Function,
  handleRemoteClick: Function,
  enabled?: boolean,
  active?: boolean,
  dispatchAction: Function,
  optimisticDispatch: Function,
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
  remote: boolean,
  big: boolean,
  onExpiryChange: Function,
  expiry: string,
  compact: boolean,
};

const JobControls: Function = ({
  handleEnableClick,
  handleActivateClick,
  handleResetClick,
  handleRunClick,
  handleScheduleClick,
  handleExpiryClick,
  handleRemoteClick,
  active,
  enabled,
  scheduleOnly,
  schedText,
  big,
  remote,
  expiry,
  compact,
}: Props): React.Element<any> =>
  scheduleOnly ? (
    <div>
      <span>{schedText}</span>{' '}
      <Button
        text="Reschedule"
        big={big}
        iconName="time"
        onClick={handleScheduleClick}
      />
    </div>
  ) : (
    <React.Fragment>
      <ButtonGroup>
        <Button
          title={enabled ? 'Disable' : 'Enable'}
          iconName="power"
          intent={enabled ? Intent.SUCCESS : Intent.DANGER}
          onClick={handleEnableClick}
          big={big}
        />
        <Button
          title={active ? 'Deactivate' : 'Activate'}
          iconName={active ? 'offline' : 'offline'}
          intent={active ? Intent.PRIMARY : Intent.NONE}
          onClick={handleActivateClick}
          big={big}
        />
        <Button
          title="Set remote"
          iconName="globe"
          intent={remote ? Intent.PRIMARY : Intent.NONE}
          onClick={handleRemoteClick}
          big={big}
        />
        {!compact && (
          <Button
            title="Set expiry"
            iconName="outdated"
            btnStyle={expiry && 'info'}
            onClick={handleExpiryClick}
            big={big}
          />
        )}
      </ButtonGroup>
      <ButtonGroup>
        <Button
          title="Run"
          iconName="play"
          onClick={handleRunClick}
          big={big}
        />
        {!compact && (
          <Button
            title="Reset"
            iconName="refresh"
            big={big}
            onClick={handleResetClick}
          />
        )}
        <Button
          title="Reschedule"
          iconName="time"
          onClick={handleScheduleClick}
          big={big}
        />
      </ButtonGroup>
    </React.Fragment>
  );

export default compose(
  connect(
    null,
    {
      activate: actions.jobs.activate,
    }
  ),
  withDispatch(),
  withModal(),
  withHandlers({
    handleEnableClick: ({
      enabled,
      dispatchAction,
      id,
    }: Props): Function => (): void => {
      dispatchAction(
        actions.jobs.jobsAction,
        enabled ? 'disable' : 'enable',
        id
      );
    },
    handleActivateClick: ({
      active,
      dispatchAction,
      id,
    }: Props): Function => (): void => {
      dispatchAction(actions.jobs.activate, id, active);
    },
    handleRunClick: ({ dispatchAction, id }: Props): Function => (): void => {
      dispatchAction(actions.jobs.run, id);
    },
    handleResetClick: ({ dispatchAction, id }: Props): Function => (): void => {
      dispatchAction(actions.jobs.jobsAction, 'reset', id);
    },
    handleRemoteClick: ({
      dispatchAction,
      id,
      remote,
    }: Props): Function => (): void => {
      dispatchAction(actions.jobs.setRemote, id, !remote);
    },
    handleScheduleClick: ({
      optimisticDispatch,
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
          action={optimisticDispatch}
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
      onExpiryChange,
      openModal,
      closeModal,
      expiry,
      id,
    }: Props): Function => (): void => {
      openModal(
        <SetExpiryModal
          onClose={closeModal}
          onExpiryChange={onExpiryChange}
          expiry={expiry}
          id={id}
        />
      );
    },
  }),
  pure([
    'enabled',
    'active',
    'id',
    'big',
    'remote',
    'minute',
    'hour',
    'day',
    'month',
    'week',
    'expiry',
  ])
)(JobControls);
