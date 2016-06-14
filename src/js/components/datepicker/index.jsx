import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import { formatDate } from '../../helpers/workflows';

import { DATES, DATE_FORMATS } from '../../constants/dates';

import { Controls, Control } from '../controls';
import Dropdown, { Control as DropdownControl, Item as DropdownItem } from '../dropdown';
import Input from './input';
import Picker from './picker';
import Calendar from './calendar';

export default class extends Component {
  static propTypes = {
    date: PropTypes.string,
    onApplyDate: PropTypes.func,
    futureOnly: PropTypes.bool,
  };

  componentWillMount() {
    this.setupDate(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.date !== nextProps.date) {
      this.setupDate(nextProps);
    }
  }

  setupDate = (props) => {
    this.hideDatepicker();

    const date = props.date ? formatDate(props.date) : moment();
    const inputDate = props.date ? date.format(DATE_FORMATS.DISPLAY) : '';

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

  setDate = (date) => {
    this.setState({
      date,
    });
  };

  setActiveDate = (activeDate) => {
    this.setState({
      activeDate,
    });
  };

  applyDate = (date) => {
    this.props.onApplyDate(date);
  };

  showDatepicker = () => {
    this.setState({
      showDatepicker: true,
    });
  };

  hideDatepicker = () => {
    this.setState({
      showDatepicker: false,
    });
  };

  handleHoursChange = (event) => {
    const hours = event.target.value;
    const activeDate = this.state.activeDate;

    activeDate.hours(hours);

    this.setState({
      activeDate,
      hours,
    });
  };

  handleMinutesChange = (event) => {
    const minutes = event.target.value;
    const activeDate = this.state.activeDate;

    activeDate.minutes(minutes);

    this.setState({
      activeDate,
      minutes,
    });
  };

  handleResetClick = () => {
    this.setState({
      hours: this.state.defaultHours,
      minutes: this.state.defaultMinutes,
    });
  };

  handleApplyClick = () => {
    const date = this.state.activeDate.format(DATE_FORMATS.URL_FORMAT);

    this.applyDate(date);
  };

  handleAllClick = () => {
    this.applyDate(DATES.ALL);
  };

  handleNowClick = () => {
    this.applyDate(DATES.NOW);
  };

  handle24hClick = () => {
    this.applyDate(DATES.PREV_DAY);
  };

  handleTodayClick = () => {
    this.applyDate(DATES.TODAY);
  };

  handleInputChange = (event) => {
    this.setState({
      inputDate: event.target.value,
    });
  };

  handleFormSubmit = (event) => {
    event.preventDefault();
    const date = new Date(this.state.inputDate);

    if (moment(date).isValid()) {
      this.applyDate(moment(date).format(DATE_FORMATS.URL_FORMAT));
    }
  };

  renderDatepicker() {
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

  renderControls() {
    if (this.props.futureOnly) return undefined;

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

  render() {
    return (
      <div className="input-group date-controls">
        <Input
          onFormSubmit={this.handleFormSubmit}
          onInputChange={this.handleInputChange}
          inputDate={this.state.inputDate}
          onInputClick={this.showDatepicker}
        />
        { this.renderControls() }
        { this.renderDatepicker() }
      </div>
    );
  }
}
