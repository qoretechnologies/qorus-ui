/* @flow */
import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import pure from 'recompose/onlyUpdateForKeys';
import { Icon } from '@blueprintjs/core';

const chunk = (arr: Array<Object>, unit: number): Array<any> => {
  const res: Object = {};

  arr.forEach((k, index) => {
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
    const v: number = Math.floor(parseInt(index, 10) / unit);

    if (res[v]) {
      res[v].push(k);
    } else {
      res[v] = [k];
    }
  });

  return _.toArray(res);
};

@pure(['date', 'activeDate'])
export default class Calendar extends Component {
  props: {
    date: Object,
    setDate: (date: Object) => void,
    activeDate: Object,
    setActiveDate: () => void,
    futureOnly: boolean,
  } = this.props;

  getDaysOfMonth (): Array<Object> {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'month' does not exist on type 'Object'.
    const month: number = this.props.date.month();
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'year' does not exist on type 'Object'.
    const year: number = this.props.date.year();
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '"isoweek"' is not assignable to ... Remove this comment to see the full error message
    const start: Object = moment([year, month]).startOf('isoweek');
    const end: Object = start
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'clone' does not exist on type 'Object'.
      .clone()
      .add(5, 'weeks')
      .add(-1, 'days');
    const days: Array<Object> = [];
    const date: Object = this.props.date;
    const activeDate: Object = this.props.activeDate;

    while (start.valueOf() <= end.valueOf()) {
      const dDate: Object = moment(start)
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'hours' does not exist on type 'Object'.
        .hours(date.hours())
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'minutes' does not exist on type 'Object'... Remove this comment to see the full error message
        .minutes(date.minutes())
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'seconds' does not exist on type 'Object'... Remove this comment to see the full error message
        .seconds(date.seconds());
      const day: Object = {
        date: dDate,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'date' does not exist on type 'Object'.
        day: start.date(),
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'month' does not exist on type 'Object'.
        month: start.month(),
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'year' does not exist on type 'Object'.
        year: start.year(),
        css: '',
      };

      if (
        start.valueOf() ===
        moment([moment().year(), moment().month(), moment().date()]).valueOf()
      ) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'is_today' does not exist on type 'Object... Remove this comment to see the full error message
        day.is_today = true;
      }
      if (
        start.valueOf() ===
        moment([
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'year' does not exist on type 'Object'.
          activeDate.year(),
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'month' does not exist on type 'Object'.
          activeDate.month(),
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'date' does not exist on type 'Object'.
          activeDate.date(),
        ]).valueOf()
      ) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'active' does not exist on type 'Object'.
        day.active = true;
      }

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'month' does not exist on type 'Object'.
      if (start.month() < month) day.css = 'old';
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'month' does not exist on type 'Object'.
      if (start.month() > month) day.css = 'new';

      if (
        this.props.futureOnly &&
        start.valueOf() <
          moment([moment().year(), moment().month(), moment().date()]).valueOf()
      ) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'css' does not exist on type 'Object'.
        day.css = 'disabled';
      }
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'is_today' does not exist on type 'Object... Remove this comment to see the full error message
      if (day.is_today) day.css += ' today';
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'active' does not exist on type 'Object'.
      if (day.active) day.css += ' active';

      days.push(day);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'add' does not exist on type 'Object'.
      start.add(1, 'days');
    }

    return days;
  }

  setDate: Function = (date: Object): void => {
    this.props.setDate(date);
  };

  setActiveDate: Function = (date: Object): void => {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
    this.props.setActiveDate(date);
  };

  nextMonth: Function = (): void => {
    const date: Object = moment(this.props.date);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'add' does not exist on type 'Object'.
    this.setDate(date.add(1, 'months'));
  };

  prevMonth: Function = (): void => {
    const date: Object = moment(this.props.date);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'add' does not exist on type 'Object'.
    this.setDate(date.add(-1, 'months'));
  };

  renderYearAndMonth: Function = (): string =>
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'format' does not exist on type 'Object'.
    `${this.props.date.format('MMM')} ${this.props.date.year()}`;

  // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  renderRows: Function = (): Array<React.Element<any>> => {
    const weeks: Array<Object> = chunk(this.getDaysOfMonth(), 7);

    // @ts-expect-error ts-migrate(2696) FIXME: The 'Object' type is assignable to very few other ... Remove this comment to see the full error message
    return weeks.reduce((wks, week, key) => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'reduce' does not exist on type 'Object'.
      const days: Array<number> = week.reduce(
        (ds, day, idx) => [
          ...ds,
          <td
            className={day.css}
            key={idx}
            onClick={() => this.setActiveDate(day.date)}
          >
            {day.day}
          </td>,
        ],
        []
      );

      // @ts-expect-error ts-migrate(2461) FIXME: Type 'Object' is not an array type.
      return [...wks, <tr key={key}>{days}</tr>];
    }, []);
  };

  // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  render (): React.Element<any> {
    return (
      <table className="table table-condensed">
        <thead>
          <tr>
            // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
            <th className="month" onClick={this.prevMonth}>
              <Icon icon="chevron-left" />
            </th>
            // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'number'.
            <th colSpan="5">{this.renderYearAndMonth()}</th>
            // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
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
