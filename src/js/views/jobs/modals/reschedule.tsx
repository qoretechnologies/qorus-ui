// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';

import Modal from '../../../components/modal';
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
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
  // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'onClose'.
  onClose: Function,
  action: Function,
  handleChange: Function,
  handleFormSubmit: Function,
  handleMinuteChange: Function,
  handleHourChange: Function,
  handleDayChange: Function,
  handleMonthChange: Function,
  handleWeekChange: Function,
  // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'onClose'.
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
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
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
      { /* @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message */ }
      <form onSubmit={handleFormSubmit}>
        <Modal.Body>
          <div>
            <ControlGroup fill>
              <InputGroup
                value={minute}
                placeholder={'Minute'}
                // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
                onChange={handleMinuteChange}
              />
              <InputGroup
                value={hour}
                placeholder={'Hour'}
                // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
                onChange={handleHourChange}
              />
              <InputGroup
                value={day}
                placeholder={'Day'}
                // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
                onChange={handleDayChange}
              />
              <InputGroup
                value={month}
                placeholder={'Month'}
                // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
                onChange={handleMonthChange}
              />
              <InputGroup
                value={week}
                placeholder={'Weekday'}
                // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'target' does not exist on type 'Object'.
      const { value } = event.target;
      const fun = props[`change${type}`];

      fun(() => value);
    },
  }),
  withHandlers({
    handleMinuteChange: ({ handleChange }: Props): Function => (
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
      event: EventHandler
    ): void => {
      handleChange('Minute', event);
    },
    handleHourChange: ({ handleChange }: Props): Function => (
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
      event: EventHandler
    ): void => {
      handleChange('Hour', event);
    },
    handleDayChange: ({ handleChange }: Props): Function => (
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
      event: EventHandler
    ): void => {
      handleChange('Day', event);
    },
    handleMonthChange: ({ handleChange }: Props): Function => (
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
      event: EventHandler
    ): void => {
      handleChange('Month', event);
    },
    handleWeekChange: ({ handleChange }: Props): Function => (
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
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
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
    }: Props): Function => (event: EventHandler): void => {
      event.preventDefault();

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
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
