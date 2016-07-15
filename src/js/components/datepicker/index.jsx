/* @flow */
import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import { formatDate } from '../../helpers/workflows';

import { DATES, DATE_FORMATS } from '../../constants/dates';

import { Controls, Control } from '../controls';
import Dropdown, { Control as DropdownControl, Item as DropdownItem } from '../dropdown';
import Input from './input';
import Picker from './picker';
import Calendar from './calendar';

type Props = {
  date: string,
  onApplyDate: (date: string) => void,
  futureOnly?: boolean,
  submitOnBlur?: boolean,
  placeholder?: string,
}

export default class DatePicker extends Component {
  props: Props;

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
    const inputDate: string = props.date ? date.format(DATE_FORMATS.DISPLAY) : '';

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
    this.setState({
      activeDate,
    });
  };

  applyDate: Function = (date: string): void => {
    this.props.onApplyDate(date);
  };

  showDatepicker: Function = (): void => {
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

  handleFormSubmit: Function = (event: Object): void => {
    event.preventDefault();

    if (this.state.inputDate === '') {
      this.applyDate('');
    } else {
      const date: Object = new Date(this.state.inputDate);

      if (moment(date).isValid()) {
        this.applyDate(moment(date).format(DATE_FORMATS.URL_FORMAT));
      }
    }
  };

  renderDatepicker(): ?React.Element<any> {
    if (!this.state.showDatepicker) return null;

    return (
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
          date={this.state.date}
          setDate={this.setDate}
          activeDate={this.state.activeDate}
          setActiveDate={this.setActiveDate}
        />
      </Picker>
    );
  }

  renderControls(): ?React.Element<Controls> {
    if (this.props.futureOnly) return null;

    return (
      <Controls grouped noControls>
        <Control
          label="All"
          btnStyle="default"
          big
          action={this.handleAllClick}
        />
        <Dropdown id="date-selection">
          <DropdownControl btnStyle="default" />
          <DropdownItem
            title="24H"
            action={this.handle24hClick}
          />
          <DropdownItem
            title="Today"
            action={this.handleTodayClick}
          />
          <DropdownItem
            title="Now"
            action={this.handleNowClick}
          />
        </Dropdown>
      </Controls>
    );
  }

  render(): React.Element<any> {
    return (
      <div className="input-group date-controls">
        <Input
          onFormSubmit={this.handleFormSubmit}
          submitOnBlur={this.props.submitOnBlur}
          onInputChange={this.handleInputChange}
          inputDate={this.state.inputDate}
          onInputClick={this.showDatepicker}
          placeholder={this.props.placeholder}
        />
        { this.renderControls() }
        { this.renderDatepicker() }
      </div>
    );
  }
}

DatePicker.propTypes = {
  date: PropTypes.string,
  onApplyDate: PropTypes.func,
  futureOnly: PropTypes.bool,
  submitOnBlur: PropTypes.bool,
  placeholder: PropTypes.string,
};
