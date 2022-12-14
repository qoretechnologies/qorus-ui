// @flow
import { ControlGroup, InputGroup } from '@blueprintjs/core';
import debounce from 'lodash/debounce';
import moment from 'moment';
import React, { Component } from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import { Control as Button, Controls } from '../../../../../components/controls';
import Datepicker from '../../../../../components/datepicker';
import Toolbar from '../../../../../components/toolbar';
import { DATE_FORMATS } from '../../../../../constants/dates';
import { formatDate } from '../../../../../helpers/date';

type Props = {
  minDateQuery: string;
  changeMinDateQuery: Function;
  maxDateQuery: string;
  changeMaxDateQuery: Function;
  errQuery: string;
  changeErrQuery: Function;
  errDescQuery: string;
  changeErrDescQuery: Function;
  producerQuery: string;
  changeProducerQuery: Function;
  changeAllQuery: Function;
  allQuery: string;
  defaultDate: string;
};

@pure(['minDateQuery', 'maxDateQuery', 'errQuery', 'errDescQuery', 'producerQuery'])
export default class SearchToolbar extends Component {
  props: Props = this.props;

  state: {
    minDate: string;
    maxDate: string;
    err: string;
    errDesc: string;
    producer: string;
  } = {
    minDate: this.props.minDateQuery || this.props.defaultDate,
    maxDate: this.props.maxDateQuery,
    err: this.props.errQuery,
    errDesc: this.props.errDescQuery,
    producer: this.props.producerQuery,
  };

  componentWillReceiveProps(nextProps: Props) {
    if (this.props !== nextProps) {
      this.setState({
        minDate: nextProps.minDateQuery || nextProps.defaultDate,
        maxDate: nextProps.maxDateQuery,
        err: nextProps.errQuery,
        errDesc: nextProps.errDescQuery,
        producer: nextProps.producerQuery,
      });
    }
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevState !== this.state) {
      this._delayedSearch(this.state);
    }
  }

  _delayedSearch: Function = debounce((data: any) => {
    this.props.changeAllQuery(data);
  }, 280);

  handleClearClick: Function = (): void => {
    this.setState({
      minDate: this.props.defaultDate,
      maxDate: '',
      err: '',
      errDesc: '',
      producer: '',
    });
  };

  handleMinDateChange: Function = (mindate: string): void => {
    const date = formatDate(mindate);

    this.setState({ minDate: moment(date).format(DATE_FORMATS.URL_FORMAT) });
  };

  handleMaxDateChange: Function = (maxDate: string): void => {
    this.setState({ maxDate });
  };

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleErrChange: Function = (event: EventHandler): void => {
    this.setState({ err: event.target.value });
  };

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleErrDescChange: Function = (event: EventHandler): void => {
    this.setState({ errDesc: event.target.value });
  };

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleProducerChange: Function = (event: EventHandler): void => {
    this.setState({ producer: event.target.value });
  };

  render() {
    return (
      <Toolbar mb>
        <div className="pull-left">
          <ControlGroup>
            <InputGroup
              type="text"
              placeholder="Error..."
              // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
              onChange={this.handleErrChange}
              value={this.state.err || ''}
              id="error"
            />

            <InputGroup
              type="text"
              placeholder="Error desc..."
              // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
              onChange={this.handleErrDescChange}
              value={this.state.errDesc || ''}
              id="errDesc"
            />
            <InputGroup
              type="text"
              placeholder="Producer..."
              // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
              onChange={this.handleProducerChange}
              value={this.state.producer || ''}
              id="producer"
            />
            <Datepicker
              placeholder="Min date..."
              date={this.state.minDate}
              // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
              onApplyDate={this.handleMinDateChange}
              applyOnBlur
              id="mindate"
            />
            <Datepicker
              placeholder="Max date..."
              date={this.state.maxDate}
              // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
              onApplyDate={this.handleMaxDateChange}
              applyOnBlur
              noButtons
              id="maxdate"
            />
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
