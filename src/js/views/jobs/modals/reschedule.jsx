// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';

import Modal from '../../../components/modal';
import { Controls, Control } from '../../../components/controls';
import actions from '../../../store/api/actions';

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
}: Props): React.Element<any> => (
  <Modal hasFooter>
    <Modal.Header onClose={onClose} titleId="reschedule-modal">
      Reschedule job
    </Modal.Header>
    <form onSubmit={handleFormSubmit}>
      <Modal.Body>
        <div className="row">
          <div className="col-lg-2 col-lg-offset-1"> Minute </div>
          <div className="col-lg-2"> Hour </div>
          <div className="col-lg-2"> Day </div>
          <div className="col-lg-2"> Month </div>
          <div className="col-lg-2"> Week </div>
        </div>
        <div className="row">
          <div className="col-lg-2 col-lg-offset-1">
            <input
              type="text"
              className="form-control"
              id="minute"
              value={minute}
              onChange={handleMinuteChange}
            />
          </div>
          <div className="col-lg-2">
            <input
              type="text"
              className="form-control"
              id="hour"
              value={hour}
              onChange={handleHourChange}
            />
          </div>
          <div className="col-lg-2">
            <input
              type="text"
              className="form-control"
              id="day"
              value={day}
              onChange={handleDayChange}
            />
          </div>
          <div className="col-lg-2">
            <input
              type="text"
              className="form-control"
              id="month"
              value={month}
              onChange={handleMonthChange}
            />
          </div>
          <div className="col-lg-2">
            <input
              type="text"
              className="form-control"
              id="week"
              value={week}
              onChange={handleWeekChange}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="pull-right">
          <Controls noControls grouped>
            <Control label="Cancel" big btnStyle="default" action={onClose} />
            <Control type="submit" big label="Save" btnStyle="success" />
          </Controls>
        </div>
      </Modal.Footer>
    </form>
  </Modal>
);

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
