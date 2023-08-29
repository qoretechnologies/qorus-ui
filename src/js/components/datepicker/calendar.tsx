/* @flow */
import { Icon } from '@blueprintjs/core';
import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';

const chunk = (arr: Array<Object>, unit: number): Array<any> => {
  const res: any = {};

  arr.forEach((k, index) => {
    // @ts-ignore ts-migrate(2345) FIXME: Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
    const v: number = Math.floor(parseInt(index, 10) / unit);

    if (res[v]) {
      res[v].push(k);
    } else {
      res[v] = [k];
    }
  });

  return _.toArray(res);
};

export default class Calendar extends Component {
  props: {
    date: any;
    setDate: (date: any) => void;
    activeDate: any;
    setActiveDate: (date: any) => void;
    futureOnly: boolean;
  } = this.props;

  getDaysOfMonth(): Array<Object> {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'month' does not exist on type 'Object'.
    const month: number = this.props.date.month();
    // @ts-ignore ts-migrate(2339) FIXME: Property 'year' does not exist on type 'Object'.
    const year: number = this.props.date.year();
    // @ts-ignore ts-migrate(2345) FIXME: Argument of type '"isoweek"' is not assignable to ... Remove this comment to see the full error message
    const start: any = moment([year, month]).startOf('isoweek');
    const end: any = start
      // @ts-ignore ts-migrate(2339) FIXME: Property 'clone' does not exist on type 'Object'.
      .clone()
      .add(5, 'weeks')
      .add(-1, 'days');
    const days: Array<Object> = [];
    const date: any = this.props.date;
    const activeDate: any = this.props.activeDate;

    while (start.valueOf() <= end.valueOf()) {
      const dDate: any = moment(start)
        // @ts-ignore ts-migrate(2339) FIXME: Property 'hours' does not exist on type 'Object'.
        .hours(date.hours())
        // @ts-ignore ts-migrate(2339) FIXME: Property 'minutes' does not exist on type 'Object'... Remove this comment to see the full error message
        .minutes(date.minutes())
        // @ts-ignore ts-migrate(2339) FIXME: Property 'seconds' does not exist on type 'Object'... Remove this comment to see the full error message
        .seconds(date.seconds());
      const day: any = {
        date: dDate,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'date' does not exist on type 'Object'.
        day: start.date(),
        // @ts-ignore ts-migrate(2339) FIXME: Property 'month' does not exist on type 'Object'.
        month: start.month(),
        // @ts-ignore ts-migrate(2339) FIXME: Property 'year' does not exist on type 'Object'.
        year: start.year(),
        css: '',
      };

      if (
        start.valueOf() === moment([moment().year(), moment().month(), moment().date()]).valueOf()
      ) {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'is_today' does not exist on type 'Object... Remove this comment to see the full error message
        day.is_today = true;
      }
      if (
        start.valueOf() ===
        moment([
          // @ts-ignore ts-migrate(2339) FIXME: Property 'year' does not exist on type 'Object'.
          activeDate.year(),
          // @ts-ignore ts-migrate(2339) FIXME: Property 'month' does not exist on type 'Object'.
          activeDate.month(),
          // @ts-ignore ts-migrate(2339) FIXME: Property 'date' does not exist on type 'Object'.
          activeDate.date(),
        ]).valueOf()
      ) {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'active' does not exist on type 'Object'.
        day.active = true;
      }

      // @ts-ignore ts-migrate(2339) FIXME: Property 'month' does not exist on type 'Object'.
      if (start.month() < month) day.css = 'old';
      // @ts-ignore ts-migrate(2339) FIXME: Property 'month' does not exist on type 'Object'.
      if (start.month() > month) day.css = 'new';

      if (
        this.props.futureOnly &&
        start.valueOf() < moment([moment().year(), moment().month(), moment().date()]).valueOf()
      ) {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'css' does not exist on type 'Object'.
        day.css = 'disabled';
      }
      // @ts-ignore ts-migrate(2339) FIXME: Property 'is_today' does not exist on type 'Object... Remove this comment to see the full error message
      if (day.is_today) day.css += ' today';
      // @ts-ignore ts-migrate(2339) FIXME: Property 'active' does not exist on type 'Object'.
      if (day.active) day.css += ' active';

      days.push(day);
      // @ts-ignore ts-migrate(2339) FIXME: Property 'add' does not exist on type 'Object'.
      start.add(1, 'days');
    }

    return days;
  }

  setDate: Function = (date: any): void => {
    this.props.setDate(date);
  };

  setActiveDate: Function = (date: any): void => {
    // @ts-ignore ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
    this.props.setActiveDate(date);
  };

  nextMonth: Function = (): void => {
    const date: any = moment(this.props.date);
    // @ts-ignore ts-migrate(2339) FIXME: Property 'add' does not exist on type 'Object'.
    this.setDate(date.add(1, 'months'));
  };

  prevMonth: Function = (): void => {
    const date: any = moment(this.props.date);
    // @ts-ignore ts-migrate(2339) FIXME: Property 'add' does not exist on type 'Object'.
    this.setDate(date.add(-1, 'months'));
  };

  renderYearAndMonth: Function = (): string =>
    // @ts-ignore ts-migrate(2339) FIXME: Property 'format' does not exist on type 'Object'.
    `${this.props.date.format('MMM')} ${this.props.date.year()}`;

  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  renderRows: Function = (): Array<React.Element<any>> => {
    const weeks: Array<Object> = chunk(this.getDaysOfMonth(), 7);

    // @ts-ignore ts-migrate(2696) FIXME: The 'Object' type is assignable to very few other ... Remove this comment to see the full error message
    return weeks.reduce((wks, week, key) => {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'reduce' does not exist on type 'Object'.
      const days: Array<number> = week.reduce(
        (ds, day, idx) => [
          ...ds,
          <td className={day.css} key={idx} onClick={() => this.setActiveDate(day.date)}>
            {day.day}
          </td>,
        ],
        []
      );

      // @ts-ignore ts-migrate(2461) FIXME: Type 'Object' is not an array type.
      return [...wks, <tr key={key}>{days}</tr>];
    }, []);
  };

  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  render() {
    return (
      <table className="table table-condensed">
        <thead>
          <tr>
            {/* @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message */}
            <th className="month" onClick={this.prevMonth}>
              <Icon icon="chevron-left" />
            </th>
            {/* @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'number'. */}
            <th colSpan="5">{this.renderYearAndMonth()}</th>
            {/* @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message */}
            <th className="month" onClick={this.nextMonth}>
              <Icon icon="chevron-right" />
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
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }
}
