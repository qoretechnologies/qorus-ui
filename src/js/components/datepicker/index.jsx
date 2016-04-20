import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import { goTo } from '../../helpers/router';
import { formatDate } from '../../helpers/workflows';

import { DATES, DATE_FORMATS } from '../../constants/dates';

import { Controls, Control } from '../controls';
import Dropdown, { Control as DropdownControl, Item as DropdownItem } from '../dropdown';
import Input from './input';
import Datepicker from './datepicker';

export default class extends Component {
  static propTypes = {
    date: PropTypes.string,
  };

  static contextTypes = {
    router: PropTypes.object,
    location: PropTypes.object,
    params: PropTypes.object,
    route: PropTypes.object,
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

    const date = formatDate(props.date);
    const inputDate = date.format('YYYY-MM-DD HH:mm:ss');

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
    goTo(
      this.context.router,
      'workflows',
      this.context.route.path,
      this.context.params,
      { date },
      this.context.location.query
    );
  };

  toggleDatepicker = () => {
    this.setState({
      showDatepicker: !this.state.showDatepicker,
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

  handleInputChange = (event) => {
    this.setState({
      inputDate: event.target.value,
    });
  };

  handleFormSubmit = (event) => {
    event.preventDefault();
    const date = this.state.inputDate;

    if (moment(date).isValid()) {
      this.applyDate(moment(date).format(DATE_FORMATS.URL_FORMAT));
    }
  };

  renderDatepicker() {
    if (!this.state.showDatepicker) return null;

    return (
      <Datepicker
        date={this.state.date}
        activeDate={this.state.activeDate}
        setDate={this.setDate}
        setActiveDate={this.setActiveDate}
        minutes={this.state.minutes}
        hours={this.state.hours}
        onAllClick={this.handleAllClick}
        on24hClick={this.handle24hClick}
        onApplyClick={this.handleApplyClick}
        onNowClick={this.handleNowClick}
        onResetClick={this.handleResetClick}
        onMinutesChange={this.handleMinutesChange}
        onHoursChange={this.handleHoursChange}
        hideDatepicker={this.hideDatepicker}
      />
    );
  }

  render() {
    return (
      <div className="input-group">
        <Input
          onFormSubmit={this.handleFormSubmit}
          onInputChange={this.handleInputChange}
          inputDate={this.state.inputDate}
          onInputFocus={this.toggleDatepicker}
        />
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
              title="Now"
              action={this.handleNowClick}
            />
          </Dropdown>
        </Controls>
        {this.renderDatepicker()}
      </div>
    );
  }
}
