import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import _ from 'lodash';

const chunk = (array, unit) => {
  const arr = {};

  for (const k in array) {
    if (array.hasOwnProperty(k)) {
      const v = Math.floor(k / unit);
      if (arr[v]) {
        arr[v].push(array[k]);
      } else {
        arr[v] = [array[k]];
      }
    }
  }

  return _.toArray(arr);
};

export default class extends Component {
  static propTypes = {
    date: PropTypes.object,
    setDate: PropTypes.func,
    activeDate: PropTypes.object,
    setActiveDate: PropTypes.func,
  };

  getDaysOfMonth() {
    const month = this.props.date.month();
    const year = this.props.date.year();
    const start = moment([year, month]).startOf('isoweek');
    const end = start.clone().add(6, 'weeks').add(-1, 'days');
    const days = [];
    const date = this.props.date;
    const activeDate = this.props.activeDate;

    while (start.valueOf() <= end.valueOf()) {
      const dDate = moment(start)
        .hours(date.hours()).minutes(date.minutes()).seconds(date.seconds());
      const day = {
        date: dDate,
        day: start.date(),
        month: start.month(),
        year: start.year(),
        css: '',
      };

      if (start.valueOf()
        === moment([moment().year(), moment().month(), moment().date()])
          .valueOf()) day.is_today = true;
      if (start.valueOf()
        === moment(
          [activeDate.year(), activeDate.month(), activeDate.date()]
        ).valueOf()) day.active = true;

      if (start.month() < month) day.css = 'old';
      if (start.month() > month) day.css = 'new';
      if (day.is_today) day.css += ' today';
      if (day.active) day.css += ' active';

      days.push(day);
      start.add(1, 'days');
    }

    return days;
  }

  setDate = (date) => {
    this.props.setDate(date);
  };

  setActiveDate = (date) => {
    this.props.setActiveDate(date);
  };

  nextMonth = () => {
    const date = moment(this.props.date);
    this.setDate(date.add(1, 'months'));
  };

  prevMonth = () => {
    const date = moment(this.props.date);
    this.setDate(date.add(-1, 'months'));
  };

  renderYearAndMonth = () => `${this.props.date.format('MMM')} ${this.props.date.year()}`;

  renderRows = () => {
    const weeks = chunk(this.getDaysOfMonth(), 7);

    return weeks.reduce((wks, week, key) => {
      const days = week.reduce((ds, day, idx) => {
        return [...ds,
          <td
            className={day.css}
            key={idx}
            onClick={() => this.setActiveDate(day.date)}
          >
            { day.day }
          </td>];
      }, []);

      return [...wks, <tr key={key}>{ days }</tr>];
    }, []);
  };

  render() {
    return (
      <table className="table table-condensed">
        <thead>
        <tr>
          <th
            className="month"
            onClick={ this.prevMonth }
          >
            <i className="fa fa-angle-left"></i>
          </th>
          <th colSpan="5">{ this.renderYearAndMonth() }</th>
          <th
            className="month"
            onClick={ this.nextMonth }
          >
            <i className="fa fa-angle-right"></i>
          </th>
        </tr>
        <tr>
          <th>Mon</th>
          <th>Tue</th>
          <th>Wed</th>
          <th>Thu</th>
          <th>Fri</th>
          <th>Sat</th>
          <th>Sun</th>
        </tr>
        </thead>
        <tbody>
          { this.renderRows() }
        </tbody>
      </table>
    );
  }
}
