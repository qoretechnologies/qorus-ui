/* @flow */
import { ControlGroup, Popover, Position } from '@blueprintjs/core';
import moment from 'moment';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import pure from 'recompose/onlyUpdateForKeys';
import { DATES, DATE_FORMATS } from '../../constants/dates';
import { formatDate } from '../../helpers/workflows';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control, Controls } from '../controls';
import Button from '../controls/control';
import Dropdown, { Control as DropdownControl, Item as DropdownItem } from '../dropdown';
import Calendar from './calendar';
import Input from './input';
import Picker from './picker';

type Props = {
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  date: string;
  onApplyDate: (date: string) => void;
  futureOnly?: boolean;
  noButtons?: boolean;
  applyOnBlur?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  small?: boolean;
  icon?: string;
  disabled?: boolean;
};

@pure(['date', 'futureOnly', 'className', 'disabled'])
@injectIntl
export default class DatePicker extends Component {
  props: Props = this.props;

  state: {
    date: Object;
    inputDate: string;
    activeDate: Object;
    hours: string;
    defaultHours: string;
    minutes: string;
    defaultMinutes: string;
    showDatepicker: boolean;
  };

  componentWillMount(): void {
    this.setupDate(this.props);
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (this.props.date !== nextProps.date) {
      this.setupDate(nextProps);
    }
  }

  setupDate = (props: Props): void => {
    this.hideDatepicker();

    const date: Object = props.date ? formatDate(props.date) : moment();
    const inputDate: string = props.date
      ? // @ts-ignore ts-migrate(2339) FIXME: Property 'format' does not exist on type 'Object'.
        date.format(DATE_FORMATS.DISPLAY)
      : '';

    this.setState({
      date,
      inputDate,
      activeDate: date,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'hours' does not exist on type 'Object'.
      hours: date.hours(),
      // @ts-ignore ts-migrate(2339) FIXME: Property 'hours' does not exist on type 'Object'.
      defaultHours: date.hours(),
      // @ts-ignore ts-migrate(2339) FIXME: Property 'minutes' does not exist on type 'Object'... Remove this comment to see the full error message
      minutes: date.minutes(),
      // @ts-ignore ts-migrate(2339) FIXME: Property 'minutes' does not exist on type 'Object'... Remove this comment to see the full error message
      defaultMinutes: date.minutes(),
      showDatepicker: false,
    });
  };

  setDate: Function = (date: Object): void => {
    this.setState({
      date,
    });
  };

  setActiveDate: Function = (activeDate: Object): void => {
    const { hours, minutes } = this.state;
    const { futureOnly } = this.props;
    const potentialDate = activeDate;

    // @ts-ignore ts-migrate(2339) FIXME: Property 'minutes' does not exist on type 'Object'... Remove this comment to see the full error message
    potentialDate.minutes(minutes);
    // @ts-ignore ts-migrate(2339) FIXME: Property 'hours' does not exist on type 'Object'.
    potentialDate.hours(hours);

    if (!futureOnly || moment().isSameOrBefore(potentialDate)) {
      this.setState({
        activeDate,
      });
    }
  };

  applyDate: Function = (date: string): void => {
    this.props.onApplyDate(date);
  };

  showDatepicker: Function = (event: any): void => {
    event.stopPropagation();

    this.setState({
      showDatepicker: true,
    });
  };

  hideDatepicker: Function = (): void => {
    this.setState({
      showDatepicker: false,
    });
  };

  handleHoursChange: Function = (event: Object): void => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'target' does not exist on type 'Object'.
    const hours: string = event.target.value;
    const activeDate: Object = this.state.activeDate;

    // @ts-ignore ts-migrate(2339) FIXME: Property 'hours' does not exist on type 'Object'.
    activeDate.hours(hours);

    this.setState({
      activeDate,
      hours,
    });
  };

  handleMinutesChange: Function = (event: Object): void => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'target' does not exist on type 'Object'.
    const minutes: string = event.target.value;
    const activeDate: Object = this.state.activeDate;

    // @ts-ignore ts-migrate(2339) FIXME: Property 'minutes' does not exist on type 'Object'... Remove this comment to see the full error message
    activeDate.minutes(minutes);

    this.setState({
      activeDate,
      minutes,
    });
  };

  handleResetClick: Function = (): void => {
    this.setState({
      hours: this.state.defaultHours,
      minutes: this.state.defaultMinutes,
    });
  };

  handleApplyClick: Function = (): void => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'format' does not exist on type 'Object'.
    const date: string = this.state.activeDate.format(DATE_FORMATS.URL_FORMAT);

    this.applyDate(date);
  };

  handleAllClick: Function = (): void => {
    this.applyDate(DATES.ALL);
  };

  handleWeekClick: Function = (): void => {
    this.applyDate(DATES.WEEK);
  };

  handleMonthClick: Function = (): void => {
    this.applyDate(DATES.MONTH);
  };

  handleThirtyClick: Function = (): void => {
    this.applyDate(DATES.THIRTY);
  };

  handleNowClick: Function = (): void => {
    this.applyDate(DATES.NOW);
  };

  handle24hClick: Function = (): void => {
    this.applyDate(DATES.PREV_DAY);
  };

  handleTodayClick: Function = (): void => {
    this.applyDate(DATES.TODAY);
  };

  handleInputChange: Function = (event: Object): void => {
    this.setState({
      // @ts-ignore ts-migrate(2339) FIXME: Property 'target' does not exist on type 'Object'.
      inputDate: event.target.value,
    });
  };

  handleApplyDate: Function = (): void => {
    if (this.state.inputDate === '') {
      this.applyDate('');
    } else {
      const date: Object = new Date(this.state.inputDate);

      if (moment(date).isValid()) {
        this.applyDate(moment(date).format(DATE_FORMATS.URL_FORMAT));
      }
    }
  };

  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  renderDatepicker(): React.Element<any> {
    if (!this.state.showDatepicker) return null;
  }

  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  renderControls(): React.Element<Controls> {
    if (this.props.futureOnly || this.props.noButtons) return null;

    return (
      <Controls grouped noControls>
        <Control
          // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
          label={this.props.intl.formatMessage({ id: 'datetime.all' })}
          btnStyle="default"
          big
          action={this.handleAllClick}
        />
        <Dropdown id="date-selection">
          {/* @ts-expect-error ts-migrate(2741) FIXME: Property 'onClick' is missing in type '{ btnStyle:... Remove this comment to see the full error message */}
          <DropdownControl btnStyle="default" />
          <DropdownItem
            // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
            title={this.props.intl.formatMessage({ id: 'datetime.now' })}
            // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
            action={this.handleNowClick}
          />
          <DropdownItem
            // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
            title={this.props.intl.formatMessage({ id: 'datetime.today' })}
            // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
            action={this.handleTodayClick}
          />
          <DropdownItem
            // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
            title={this.props.intl.formatMessage({ id: 'datetime.24h' })}
            // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
            action={this.handle24hClick}
          />
          <DropdownItem
            // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
            title={this.props.intl.formatMessage({ id: 'datetime.week' })}
            // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
            action={this.handleWeekClick}
          />
          <DropdownItem
            // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
            title={this.props.intl.formatMessage({ id: 'datetime.this-month' })}
            // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
            action={this.handleMonthClick}
          />
          <DropdownItem
            // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
            title={this.props.intl.formatMessage({ id: 'datetime.30-days' })}
            // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
            action={this.handleThirtyClick}
          />
        </Dropdown>
      </Controls>
    );
  }

  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  render(): React.Element<any> {
    const { futureOnly, noButtons, small, className, icon, disabled } = this.props;

    return (
      <ControlGroup className={`vab ${className}`} style={{ verticalAlign: 'top' }}>
        <Button
          icon={icon || 'timeline-events'}
          big={!small}
          onClick={this.showDatepicker}
          disabled={disabled}
        />
        <Popover
          isOpen={this.state.showDatepicker}
          position={Position.BOTTOM}
          content={
            // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
            <Picker
              minutes={this.state.minutes}
              hours={this.state.hours}
              onAllClick={this.handleAllClick}
              on24hClick={this.handle24hClick}
              onApplyClick={this.handleApplyClick}
              onResetClick={this.handleResetClick}
              onMinutesChange={this.handleMinutesChange}
              onHoursChange={this.handleHoursChange}
              hideDatepicker={this.hideDatepicker}
              futureOnly={this.props.futureOnly}
            >
              {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
              <Calendar
                futureOnly={this.props.futureOnly}
                date={this.state.date}
                setDate={this.setDate}
                activeDate={this.state.activeDate}
                setActiveDate={this.setActiveDate}
              />
            </Picker>
          }
        >
          <Input
            onApplyDate={this.handleApplyDate}
            applyOnBlur={this.props.applyOnBlur}
            onInputChange={this.handleInputChange}
            inputDate={this.state.inputDate}
            onInputClick={this.showDatepicker}
            placeholder={this.props.placeholder}
            id={this.props.id}
            name={this.props.name}
            className={small && 'datepicker-input-small bp3-small'}
            disabled={disabled}
          />
        </Popover>

        {!futureOnly && !noButtons && (
          <Button
            // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
            text={this.props.intl.formatMessage({ id: 'datetime.all' })}
            onClick={this.handleAllClick}
            big={!small}
            disabled={disabled}
          />
        )}
        {!futureOnly && !noButtons && (
          // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
          <Dropdown disabled={disabled}>
            {/* @ts-expect-error ts-migrate(2739) FIXME: Type '{ small: boolean; }' is missing the followin... Remove this comment to see the full error message */}
            <DropdownControl small={small} />
            <DropdownItem
              // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
              title={this.props.intl.formatMessage({ id: 'datetime.now' })}
              // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
              onClick={this.handleNowClick}
            />
            <DropdownItem
              // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
              title={this.props.intl.formatMessage({ id: 'datetime.today' })}
              // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
              onClick={this.handleTodayClick}
            />
            <DropdownItem
              // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
              title={this.props.intl.formatMessage({ id: 'datetime.24h' })}
              // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
              onClick={this.handle24hClick}
            />
            <DropdownItem
              // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
              title={this.props.intl.formatMessage({ id: 'datetime.week' })}
              // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
              onClick={this.handleWeekClick}
            />
            <DropdownItem
              // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
              title={this.props.intl.formatMessage({
                id: 'datetime.this-month',
              })}
              // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
              onClick={this.handleMonthClick}
            />
            <DropdownItem
              // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
              title={this.props.intl.formatMessage({ id: 'datetime.30-days' })}
              // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
              onClick={this.handleThirtyClick}
            />
          </Dropdown>
        )}
        {this.renderDatepicker()}
      </ControlGroup>
    );
  }
}
