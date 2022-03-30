// @flow
import React, { Component } from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import debounce from 'lodash/debounce';
import moment from 'moment';

import Toolbar from '../../../../../components/toolbar';
import Datepicker from '../../../../../components/datepicker';
import {
  Controls,
  Control as Button,
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
} from '../../../../../components/controls';
import Dropdown, {
  Control as DropdownToggle,
  Item,
} from '../../../../../components/dropdown';
import { formatDate } from '../../../../../helpers/date';
import { transformSuccess } from '../../../../../helpers/slas';
import { DATE_FORMATS } from '../../../../../constants/dates';
import {
  InputGroup,
  ControlGroup,
} from '../../../../../../../node_modules/@blueprintjs/core';

type Props = {
  minDateQuery: string,
  changeMinDateQuery: Function,
  maxDateQuery: string,
  changeMaxDateQuery: Function,
  errQuery: string,
  changeErrQuery: Function,
  errDescQuery: string,
  changeErrDescQuery: Function,
  producerQuery: string,
  changeProducerQuery: Function,
  groupingQuery: string,
  changeGroupingQuery: Function,
  successQuery: string,
  changeSuccessQuery: Function,
  changeAllQuery: Function,
  allQuery: string,
  defaultDate: string,
};

@pure([
  'minDateQuery',
  'maxDateQuery',
  'errQuery',
  'errDescQuery',
  'producerQuery',
  'groupingQuery',
  'successQuery',
])
export default class SearchToolbar extends Component {
  props: Props = this.props;

  state: {
    minDate: string,
    maxDate: string,
    err: string,
    errDesc: string,
    producer: string,
    grouping: string,
    success: string,
  } = {
    minDate: this.props.minDateQuery || this.props.defaultDate,
    maxDate: this.props.maxDateQuery,
    err: this.props.errQuery,
    errDesc: this.props.errDescQuery,
    producer: this.props.producerQuery,
    grouping: this.props.groupingQuery || 'hourly',
    success: transformSuccess(this.props.successQuery),
  };

  componentWillReceiveProps(nextProps: Props) {
    if (this.props !== nextProps) {
      this.setState({
        minDate: nextProps.minDateQuery || this.props.defaultDate,
        maxDate: nextProps.maxDateQuery,
        err: nextProps.errQuery,
        errDesc: nextProps.errDescQuery,
        producer: nextProps.producerQuery,
        grouping: nextProps.groupingQuery,
        success: transformSuccess(nextProps.successQuery),
      });
    }
  }

  componentDidUpdate(prevProps: Object, prevState: Object) {
    if (prevState !== this.state) {
      this._delayedSearch(this.state);
    }
  }

  _delayedSearch: Function = debounce((data: Object) => {
    const dt: Object = {
      ...data,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'success' does not exist on type 'Object'... Remove this comment to see the full error message
      ...{ success: transformSuccess(data.success) },
    };

    this.props.changeAllQuery(dt);
  }, 280);

  handleClearClick: Function = (): void => {
    this.setState({
      minDate: this.props.defaultDate,
      maxDate: '',
      err: '',
      errDesc: '',
      producer: '',
      grouping: 'hourly',
      success: transformSuccess(''),
    });
  };

  handleMinDateChange: Function = (mindate: string): void => {
    const date = formatDate(mindate);

    this.setState({ minDate: moment(date).format(DATE_FORMATS.URL_FORMAT) });
  };

  handleMaxDateChange: Function = (maxDate: string): void => {
    this.setState({ maxDate });
  };

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleErrChange: Function = (event: EventHandler): void => {
    this.setState({ err: event.target.value });
  };

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleErrDescChange: Function = (event: EventHandler): void => {
    this.setState({ errDesc: event.target.value });
  };

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleProducerChange: Function = (event: EventHandler): void => {
    this.setState({ producer: event.target.value });
  };

  handleGroupingChange: Function = (
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
    event: EventHandler,
    value: string
  ): void => {
    this.setState({ grouping: value });
  };

  handleSuccessChange: Function = (
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
    event: EventHandler,
    value: string
  ): void => {
    this.setState({ success: value });
  };

  render() {
    return (
      <Toolbar mb>
        <div className="pull-left">
          <ControlGroup>
            // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
            <Dropdown>
              // @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: string[]; }' is missing the foll... Remove this comment to see the full error message
              <DropdownToggle>Grouping: {this.state.grouping}</DropdownToggle>
              // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
              <Item title="hourly" action={this.handleGroupingChange} />
              // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
              <Item title="daily" action={this.handleGroupingChange} />
              // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
              <Item title="monthly" action={this.handleGroupingChange} />
              // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
              <Item title="yearly" action={this.handleGroupingChange} />
            </Dropdown>
            <InputGroup
              type="text"
              placeholder="Error..."
              // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
              onChange={this.handleErrChange}
              value={this.state.err || ''}
              id="error"
            />
            <InputGroup
              type="text"
              placeholder="Error desc..."
              // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
              onChange={this.handleErrDescChange}
              value={this.state.errDesc || ''}
              id="errDesc"
            />
            <InputGroup
              type="text"
              placeholder="Producer..."
              // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
              onChange={this.handleProducerChange}
              value={this.state.producer || ''}
              id="producer"
            />
            <Datepicker
              placeholder="Min date..."
              date={this.state.minDate}
              // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
              onApplyDate={this.handleMinDateChange}
              applyOnBlur
              id="mindate"
            />
            <Datepicker
              placeholder="Max date..."
              date={this.state.maxDate}
              // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
              onApplyDate={this.handleMaxDateChange}
              applyOnBlur
              noButtons
              id="maxdate"
            />
            // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
            <Dropdown>
              // @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: string[]; }' is missing the foll... Remove this comment to see the full error message
              <DropdownToggle>Success: {this.state.success}</DropdownToggle>
              // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
              <Item title="All" action={this.handleSuccessChange} />
              // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
              <Item title="Yes" action={this.handleSuccessChange} />
              // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
              <Item title="No" action={this.handleSuccessChange} />
            </Dropdown>
          </ControlGroup>
        </div>
        <div className="pull-right">
          <Controls noControls grouped>
            <Button
              label="Clear"
              icon="remove"
              btnStyle="default"
              big
              action={this.handleClearClick}
            />
          </Controls>
        </div>
      </Toolbar>
    );
  }
}
