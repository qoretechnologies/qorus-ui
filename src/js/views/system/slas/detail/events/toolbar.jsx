// @flow
import React, { Component } from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import debounce from 'lodash/debounce';
import moment from 'moment';

import Toolbar from '../../../../../components/toolbar';
import Datepicker from '../../../../../components/datepicker';
import { Controls, Control as Button } from '../../../../../components/controls';
import { formatDate } from '../../../../../helpers/date';
import { DATE_FORMATS } from '../../../../../constants/dates';

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
])
export default class SearchToolbar extends Component {
  props: Props;

  state: {
    minDate: string,
    maxDate: string,
    err: string,
    errDesc: string,
    producer: string,
  } = {
    minDate: this.props.minDateQuery,
    maxDate: this.props.maxDateQuery,
    err: this.props.errQuery,
    errDesc: this.props.errDescQuery,
    producer: this.props.producerQuery,
  };

  componentWillReceiveProps(nextProps: Props) {
    if (this.props !== nextProps) {
      this.setState({
        minDate: nextProps.minDateQuery,
        maxDate: nextProps.maxDateQuery,
        err: nextProps.errQuery,
        errDesc: nextProps.errDescQuery,
        producer: nextProps.producerQuery,
      });
    }
  }

  componentDidUpdate(prevProps: Object, prevState: Object) {
    if (prevState !== this.state) {
      this._delayedSearch(this.state);
    }
  }

  _delayedSearch: Function = debounce((data: Object) => {
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

  handleErrChange: Function = (event: EventHandler): void => {
    this.setState({ err: event.target.value });
  };

  handleErrDescChange: Function = (event: EventHandler): void => {
    this.setState({ errDesc: event.target.value });
  };

  handleProducerChange: Function = (event: EventHandler): void => {
    this.setState({ producer: event.target.value });
  };

  render() {
    return (
      <Toolbar>
        <div className="pull-left">
          <div className="form-group search-toolbar">
            <div className="pull-left">
              <input
                className="form-control search-input"
                type="text"
                placeholder="Error..."
                onChange={this.handleErrChange}
                value={this.state.err || ''}
                id="error"
              />
            </div>
            <div className="pull-left">
              <input
                className="form-control search-input"
                type="text"
                placeholder="Error desc..."
                onChange={this.handleErrDescChange}
                value={this.state.errDesc || ''}
                id="errDesc"
              />
            </div>
            <div className="pull-left">
              <input
                className="form-control search-input"
                type="text"
                placeholder="Producer..."
                onChange={this.handleProducerChange}
                value={this.state.producer || ''}
                id="producer"
              />
            </div>
            <div className="pull-left">
              <Datepicker
                placeholder="Min date..."
                date={this.state.minDate}
                onApplyDate={this.handleMinDateChange}
                applyOnBlur
                id="mindate"
              />
            </div>
            <div className="pull-left">
              <Datepicker
                placeholder="Max date..."
                date={this.state.maxDate}
                onApplyDate={this.handleMaxDateChange}
                applyOnBlur
                noButtons
                id="maxdate"
              />
            </div>
          </div>
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
