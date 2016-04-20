import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { goTo } from '../../helpers/router';
import { formatDate } from '../../helpers/workflows';

import { DATES, DATE_FORMATS } from '../../constants/dates';

import Calendar from './calendar';
import { Controls, Control } from 'components/controls';
import Dropdown, { Control as DropdownControl, Item as DropdownItem } from 'components/dropdown';

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

  componentDidMount() {
    this._el = ReactDOM.findDOMNode(this.refs.datepicker);
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

    if (moment(new Date(date)).isValid()) {
      this.applyDate(moment(date).format(DATE_FORMATS.URL_FORMAT));
    }
  };

  renderDatepicker() {
    if (!this.state.showDatepicker) return null;

    return (
      <div className="datepicker" ref="datepicker">
        <Calendar
          date={this.state.date}
          setDate={this.setDate}
          activeDate={this.state.activeDate}
          setActiveDate={this.setActiveDate}
        />
        <div className="hours row-fluid">
          <div className="input-group">
            <div className="input-group-addon">
              <i className="fa fa-clock-o" />
            </div>
            <input
              type="number"
              name="hours"
              max="23"
              min="0"
              value={this.state.hours}
              onChange={this.handleHoursChange}
              className="text-center form-control"
            />
            <div className="input-group-addon">:</div>
            <input
              type="number"
              name="minutes"
              max="59"
              min="0"
              value={this.state.minutes}
              onChange={this.handleMinutesChange}
              className="text-center form-control"
            />
            <div className="input-group-btn">
              <Control
                icon="times"
                btnStyle="danger"
                big
                action={this.handleResetClick}
              />
            </div>
          </div>
        </div>
        <Controls grouped noControls>
          <Control
            label="24h"
            btnStyle="default"
            big
            action={this.handle24hClick}
          />
          <Control
            label="All"
            btnStyle="default"
            big
            action={this.handleAllClick}
          />
        </Controls>
        <button
          className="btn btn-primary pull-right"
          onClick={this.handleApplyClick}
        >Apply
        </button>
      </div>
    );
  }

  render() {
    return (
      <div className="input-group">
        <form onSubmit={this.handleFormSubmit} className="datepicker-group">
          <div className="input-group">
            <span className="input-group-addon">
              <i className="fa fa-calendar" />
            </span>
            <input
              type="text"
              className="form-control"
              value={this.state.inputDate}
              onChange={this.handleInputChange}
              onFocus={this.toggleDatepicker}
            />
          </div>
        </form>
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
