// @flow
import { Intent } from '@blueprintjs/core';
import { ReqoreControlGroup } from '@qoretechnologies/reqore';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { WebIDEButton } from '../../components/WebIDEButton';
import { Control as Button } from '../../components/controls';
import withModal from '../../hocomponents/modal';
import withDispatch from '../../hocomponents/withDispatch';
import actions from '../../store/api/actions';
import SetExpiryModal from './modals/expiry';
import RescheduleModal from './modals/reschedule';

type Props = {
  handleEnableClick: Function;
  handleActivateClick: Function;
  handleResetClick: Function;
  handleRunClick: Function;
  handleScheduleClick: Function;
  handleExpiryClick: Function;
  handleRemoteClick: Function;
  enabled?: boolean;
  active?: boolean;
  dispatchAction: Function;
  optimisticDispatch: Function;
  id: number;
  openModal: Function;
  closeModal: Function;
  minute: string;
  hour: string;
  day: string;
  month: string;
  week: string;
  scheduleOnly?: boolean;
  schedText: string;
  remote: boolean;
  big: boolean;
  onExpiryChange: Function;
  expiry: string;
  compact: boolean;
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
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
  id,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) =>
  scheduleOnly ? (
    <div>
      <span>{schedText}</span>{' '}
      <Button
        text={intl.formatMessage({ id: 'button.reschedule' })}
        big={big}
        icon="time"
        onClick={handleScheduleClick}
      />
    </div>
  ) : (
    <ReqoreControlGroup>
      <ReqoreControlGroup stack>
        <Button
          title={intl.formatMessage({
            id: enabled ? 'button.disable' : 'button.enable',
          })}
          icon="power"
          intent={enabled ? Intent.SUCCESS : Intent.DANGER}
          onClick={handleEnableClick}
          big={big}
        />
        <Button
          title={intl.formatMessage({
            id: active ? 'button.deactivate' : 'button.activate',
          })}
          icon={active ? 'offline' : 'offline'}
          intent={active ? Intent.PRIMARY : Intent.NONE}
          onClick={handleActivateClick}
          big={big}
        />
        <Button
          title={intl.formatMessage({
            id: remote ? 'button.set-not-remote' : 'button.set-remote',
          })}
          icon="globe"
          intent={remote ? Intent.PRIMARY : Intent.NONE}
          onClick={handleRemoteClick}
          big={big}
        />
        {!compact && (
          <Button
            title={intl.formatMessage({ id: 'button.set-expiry' })}
            icon="outdated"
            btnStyle={expiry && 'info'}
            onClick={handleExpiryClick}
            big={big}
          />
        )}
      </ReqoreControlGroup>
      <ReqoreControlGroup stack>
        <Button
          title={intl.formatMessage({ id: 'button.run' })}
          icon="play"
          onClick={handleRunClick}
          big={big}
        />
        {!compact && (
          <Button
            title={intl.formatMessage({ id: 'button.reset' })}
            icon="refresh"
            big={big}
            onClick={handleResetClick}
          />
        )}
        <Button
          title={intl.formatMessage({ id: 'button.reschedule' })}
          icon="time"
          onClick={handleScheduleClick}
          big={big}
        />
      </ReqoreControlGroup>
      <WebIDEButton id={id} type="job" big={big} />
    </ReqoreControlGroup>
  );

export default compose(
  connect(null, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
    activate: actions.jobs.activate,
  }),
  withDispatch(),
  withModal(),
  withHandlers({
    handleEnableClick:
      ({ enabled, dispatchAction, id }: Props): Function =>
      (): void => {
        dispatchAction(
          // @ts-ignore ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
          actions.jobs.jobsAction,
          enabled ? 'disable' : 'enable',
          id
        );
      },
    handleActivateClick:
      ({ active, dispatchAction, id }: Props): Function =>
      (): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
        dispatchAction(actions.jobs.activate, id, active);
      },
    handleRunClick:
      ({ dispatchAction, id }: Props): Function =>
      (): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
        dispatchAction(actions.jobs.run, id);
      },
    handleResetClick:
      ({ dispatchAction, id }: Props): Function =>
      (): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
        dispatchAction(actions.jobs.jobsAction, 'reset', id);
      },
    handleRemoteClick:
      ({ dispatchAction, id, remote }: Props): Function =>
      (): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
        dispatchAction(actions.jobs.setRemote, id, !remote);
      },
    handleScheduleClick:
      ({
        optimisticDispatch,
        openModal,
        closeModal,
        id,
        minute,
        hour,
        day,
        month,
        week,
      }: Props): Function =>
      (): void => {
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
    handleExpiryClick:
      ({ onExpiryChange, openModal, closeModal, expiry, id }: Props): Function =>
      (): void => {
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
  ]),
  injectIntl
)(JobControls);
