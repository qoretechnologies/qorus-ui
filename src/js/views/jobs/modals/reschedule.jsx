// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';

import Modal from '../../../components/modal';
import { Controls, Control } from '../../../components/controls';
import actions from '../../../store/api/actions';
import { ControlGroup, InputGroup } from '@blueprintjs/core';
import cronstrue from 'cronstrue';
import ScheduleText from '../../../components/ScheduleText';

type Props = {
  id: number,
  minute: string,
  hour: string,
  day: string,
  month: string,
  week: string,
  onClose: Function,
  action: Function,
  handleChange: Function,
  handleFormSubmit: Function,
  handleMinuteChange: Function,
  handleHourChange: Function,
  handleDayChange: Function,
  handleMonthChange: Function,
  handleWeekChange: Function,
  onClose: Function,
};

const Schedule: Function = ({
  onClose,
  handleFormSubmit,
  handleMinuteChange,
  handleHourChange,
  handleDayChange,
  handleMonthChange,
  handleWeekChange,
  minute,
  hour,
  day,
  month,
  week,
}: Props): React.Element<any> => {
  const cron = `${minute} ${hour} ${day} ${month} ${week}`;

  let isError = false;

  try {
    cronstrue.toString(cron);
  } catch (e) {
    isError = true;
  }

  return (
    <Modal hasFooter>
      <Modal.Header onClose={onClose} titleId="reschedule-modal">
        Reschedule job
      </Modal.Header>
      <form onSubmit={handleFormSubmit}>
        <Modal.Body>
          <div>
            <ControlGroup fill>
              <InputGroup
                value={minute}
                placeholder={'Minute'}
                onChange={handleMinuteChange}
              />
              <InputGroup
                value={hour}
                placeholder={'Hour'}
                onChange={handleHourChange}
              />
              <InputGroup
                value={day}
                placeholder={'Day'}
                onChange={handleDayChange}
              />
              <InputGroup
                value={month}
                placeholder={'Month'}
                onChange={handleMonthChange}
              />
              <InputGroup
                value={week}
                placeholder={'Weekday'}
                onChange={handleWeekChange}
              />
            </ControlGroup>
          </div>
          <ScheduleText cron={cron} />
        </Modal.Body>
        <Modal.Footer>
          <div className="pull-right">
            <Controls noControls grouped>
              <Control label="Cancel" big btnStyle="default" action={onClose} />
              <Control
                type="submit"
                big
                label="Save"
                btnStyle="success"
                disabled={isError}
              />
            </Controls>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default compose(
  withState('minute', 'changeMinute', ({ minute }) => minute || ''),
  withState('hour', 'changeHour', ({ hour }) => hour || ''),
  withState('day', 'changeDay', ({ day }) => day || ''),
  withState('month', 'changeMonth', ({ month }) => month || ''),
  withState('week', 'changeWeek', ({ week }) => week || ''),
  withHandlers({
    handleChange: (props: Props): Function => (
      type: string,
      event: Object
    ): void => {
      const { value } = event.target;
      const fun = props[`change${type}`];

      fun(() => value);
    },
  }),
  withHandlers({
    handleMinuteChange: ({ handleChange }: Props): Function => (
      event: EventHandler
    ): void => {
      handleChange('Minute', event);
    },
    handleHourChange: ({ handleChange }: Props): Function => (
      event: EventHandler
    ): void => {
      handleChange('Hour', event);
    },
    handleDayChange: ({ handleChange }: Props): Function => (
      event: EventHandler
    ): void => {
      handleChange('Day', event);
    },
    handleMonthChange: ({ handleChange }: Props): Function => (
      event: EventHandler
    ): void => {
      handleChange('Month', event);
    },
    handleWeekChange: ({ handleChange }: Props): Function => (
      event: EventHandler
    ): void => {
      handleChange('Week', event);
    },
    handleFormSubmit: ({
      action,
      id,
      onClose,
      minute,
      hour,
      day,
      month,
      week,
    }: Props): Function => (event: EventHandler): void => {
      event.preventDefault();

      action(actions.jobs.reschedule, id, {
        minute,
        hour,
        day,
        month,
        wday: week,
      });
      onClose();
    },
  }),
  pure(['minute', 'hour', 'day', 'month', 'week'])
)(Schedule);
