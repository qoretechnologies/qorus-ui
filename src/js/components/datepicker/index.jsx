import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { goTo } from '../../helpers/router';

import Calendar from './calendar';
import { Controls, Control } from 'components/controls';

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
    const date = this.props.date === '24h' || this.props.date === undefined ?
      moment().add(-1, 'days') : moment(this.props.date, 'YYYYMMDDHHmmss');

    this.setState({
      date,
      activeDate: date,
      hours: date.hours(),
      minutes: date.minutes(),
      showDatepicker: false,
    });
  }

  componentDidMount() {
    this._el = ReactDOM.findDOMNode(this.refs.datepicker);
  }

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
    const date = moment().add(-1, 'days');

    this.setState({
      date,
      activeDate: date,
      hours: date.hours(),
      minutes: date.minutes(),
    });
  };

  handleApplyClick = () => {
    const date = this.state.activeDate.format('YYYYMMDDHHmmss');

    goTo(
      this.context.router,
      'workflows',
      this.context.route.path,
      this.context.params,
      { date },
      this.context.location.query
    );
  };

  renderDatepicker() {
    if (!this.state.showDatepicker) return null;

    return (
      <div className="datepicker" ref="datepicker">
        <Calendar
          date={this.state.date}
          activeDate={this.state.activeDate}
          setActiveDate={this.setActiveDate}
          setDate={this.setDate}
        />
        <div className="hours row-fluid">
          <div className="input-group">
            <div className="input-group-addon">
              <i className="fa fa-clock-o"/>
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
          />
          <Control
            label="All"
            btnStyle="default"
            big
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
      <Controls grouped noControls>
        <Control
          label="All"
          btnStyle="default"
          big
        />
        {this.renderDatepicker()}
      </Controls>
    );
  }
}
