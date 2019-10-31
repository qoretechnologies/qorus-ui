/* @flow */
import React, { Component } from 'react';
import moment from 'moment';
import { formatDate } from '../../helpers/workflows';
import pure from 'recompose/onlyUpdateForKeys';
import { ControlGroup, Popover, Position } from '@blueprintjs/core';
import Button from '../controls/control';

import { DATES, DATE_FORMATS } from '../../constants/dates';

import { Controls, Control } from '../controls';
import Dropdown, {
  Control as DropdownControl,
  Item as DropdownItem,
} from '../dropdown';
import Input from './input';
import Picker from './picker';
import Calendar from './calendar';
import { injectIntl } from 'react-intl';

type Props = {
  date: ?string,
  onApplyDate: (date: string) => void,
  futureOnly?: boolean,
  noButtons?: boolean,
  applyOnBlur?: boolean,
  placeholder?: string,
  className?: string,
  id?: string,
  name?: string,
  small?: boolean,
  icon?: string,
  disabled?: boolean,
};

@pure(['date', 'futureOnly', 'className', 'disabled'])
@injectIntl
export default class DatePicker extends Component {
  props: Props = this.props;

  state: {
    date: Object,
    inputDate: string,
    activeDate: Object,
    hours: string,
    defaultHours: string,
    minutes: string,
    defaultMinutes: string,
    showDatepicker: boolean,
  };

  componentWillMount (): void {
    this.setupDate(this.props);
  }

  componentWillReceiveProps (nextProps: Props): void {
    if (this.props.date !== nextProps.date) {
      this.setupDate(nextProps);
    }
  }

  setupDate = (props: Props): void => {
    this.hideDatepicker();

    const date: Object = props.date ? formatDate(props.date) : moment();
    const inputDate: string = props.date
      ? date.format(DATE_FORMATS.DISPLAY)
      : '';

    this.setState({
      date,
      inputDate,
      activeDate: date,
      hours: date.hours(),
      defaultHours: date.hours(),
      minutes: date.minutes(),
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

    potentialDate.minutes(minutes);
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
    const hours: string = event.target.value;
    const activeDate: Object = this.state.activeDate;

    activeDate.hours(hours);

    this.setState({
      activeDate,
      hours,
    });
  };

  handleMinutesChange: Function = (event: Object): void => {
    const minutes: string = event.target.value;
    const activeDate: Object = this.state.activeDate;

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

  renderDatepicker (): ?React.Element<any> {
    if (!this.state.showDatepicker) return null;
  }

  renderControls (): ?React.Element<Controls> {
    if (this.props.futureOnly || this.props.noButtons) return null;

    return (
      <Controls grouped noControls>
        <Control
          label={this.props.intl.formatMessage({ id: 'datetime.all' })}
          btnStyle="default"
          big
          action={this.handleAllClick}
        />
        <Dropdown id="date-selection">
          <DropdownControl btnStyle="default" />
          <DropdownItem
            title={this.props.intl.formatMessage({ id: 'datetime.now' })}
            action={this.handleNowClick}
          />
          <DropdownItem
            title={this.props.intl.formatMessage({ id: 'datetime.today' })}
            action={this.handleTodayClick}
          />
          <DropdownItem
            title={this.props.intl.formatMessage({ id: 'datetime.24h' })}
            action={this.handle24hClick}
          />
          <DropdownItem
            title={this.props.intl.formatMessage({ id: 'datetime.week' })}
            action={this.handleWeekClick}
          />
          <DropdownItem
            title={this.props.intl.formatMessage({ id: 'datetime.this-month' })}
            action={this.handleMonthClick}
          />
          <DropdownItem
            title={this.props.intl.formatMessage({ id: 'datetime.30-days' })}
            action={this.handleThirtyClick}
          />
        </Dropdown>
      </Controls>
    );
  }

  render (): React.Element<any> {
    const {
      futureOnly,
      noButtons,
      small,
      className,
      icon,
      disabled,
    } = this.props;

    return (
      <ControlGroup className={`vab ${className}`}>
        <Button
          iconName={icon || 'timeline-events'}
          big={!small}
          onClick={this.showDatepicker}
          disabled={disabled}
        />
        <Popover
          isOpen={this.state.showDatepicker}
          position={Position.BOTTOM}
          content={
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
            className={small && 'datepicker-input-small pt-small'}
            disabled={disabled}
          />
        </Popover>

        {!futureOnly && !noButtons && (
          <Button
            text={this.props.intl.formatMessage({ id: 'datetime.all' })}
            onClick={this.handleAllClick}
            big={!small}
            disabled={disabled}
          />
        )}
        {!futureOnly && !noButtons && (
          <Dropdown disabled={disabled}>
            <DropdownControl small={small} />
            <DropdownItem
              title={this.props.intl.formatMessage({ id: 'datetime.now' })}
              onClick={this.handleNowClick}
            />
            <DropdownItem
              title={this.props.intl.formatMessage({ id: 'datetime.today' })}
              onClick={this.handleTodayClick}
            />
            <DropdownItem
              title={this.props.intl.formatMessage({ id: 'datetime.24h' })}
              onClick={this.handle24hClick}
            />
            <DropdownItem
              title={this.props.intl.formatMessage({ id: 'datetime.week' })}
              onClick={this.handleWeekClick}
            />
            <DropdownItem
              title={this.props.intl.formatMessage({ id: 'datetime.this-month' })}
              onClick={this.handleMonthClick}
            />
            <DropdownItem
              title={this.props.intl.formatMessage({ id: 'datetime.30-days' })}
              onClick={this.handleThirtyClick}
            />
          </Dropdown>
        )}
        {this.renderDatepicker()}
      </ControlGroup>
    );
  }
}
