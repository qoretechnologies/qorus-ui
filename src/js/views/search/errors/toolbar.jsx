// @flow
import React, { Component } from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import debounce from 'lodash/debounce';
import moment from 'moment';

import Toolbar from '../../../components/toolbar';
import Datepicker from '../../../components/datepicker';
import { Controls, Control as Button } from '../../../components/controls';
import Dropdown, { Item, Control } from '../../../components/dropdown';
import { ORDER_STATES } from '../../../constants/orders';
import { formatDate } from '../../../helpers/date';
import { DATE_FORMATS } from '../../../constants/dates';
import HistoryModal from '../modals/history';

type Props = {
  mindateQuery: string,
  changeMindateQuery: Function,
  maxdateQuery: string,
  changeMaxdateQuery: Function,
  filterQuery: string,
  changeFilterQuery: Function,
  idsQuery: string,
  changeIdsQuery: Function,
  nameQuery: string,
  changeNameQuery: Function,
  errorQuery: string,
  changeErrorQuery: Function,
  retryQuery: string,
  changeRetryQuery: Function,
  busErrQuery: string,
  changeBuserrQuery: Function,
  changeAllQuery: Function,
  defaultDate: string,
  workflows: Array<string>,
  allQuery: string,
  username: string,
  openModal: Function,
  closeModal: Function,
  saveSearch: Function,
};

@pure([
  'mindateQuery',
  'maxdateQuery',
  'filterQuery',
  'nameQuery',
  'errorQuery',
  'idsQuery',
  'retryQuery',
  'busErrQuery',
  'workflows',
])
export default class SearchToolbar extends Component {
  props: Props;

  state: {
    mindate: string,
    maxdate: string,
    filter: string,
    ids: string,
    name: string,
    error: string,
    retry: string,
    busErr: string,
  } = {
    mindate: this.props.mindateQuery,
    maxdate: this.props.maxdateQuery,
    filter: this.props.filterQuery,
    ids: this.props.idsQuery,
    name: this.props.nameQuery,
    error: this.props.errorQuery,
    retry: this.props.retryQuery,
    busErr: this.props.busErrQuery,
  };

  componentWillReceiveProps(nextProps: Props) {
    if (this.props !== nextProps) {
      this.setState({
        mindate: nextProps.mindateQuery,
        maxdate: nextProps.maxdateQuery,
        filter: nextProps.filterQuery,
        ids: nextProps.idsQuery,
        name: nextProps.nameQuery,
        error: nextProps.errorQuery,
        retry: nextProps.retryQuery,
        busErr: nextProps.busErrQuery,
      });
    }
  }

  componentDidUpdate() {
    this._delayedSearch(this.state);
  }

  _delayedSearch: Function = debounce((data: Object) => {
    this.props.changeAllQuery(data);
  }, 280);

  handleHistoryClick: Function = (): void => {
    this.props.openModal(
      <HistoryModal
        type="errorSearch"
        onClose={this.props.closeModal}
      />
    );
  };

  handleSaveClick: Function = (): void => {
    this.props.saveSearch(
      'errorSearch',
      this.props.allQuery,
      this.props.username,
    );
  };

  handleClearClick: Function = (): void => {
    this.setState({
      mindate: this.props.defaultDate,
      maxdate: '',
      filter: '',
      ids: '',
      name: '',
      error: '',
      retry: '',
      busErr: '',
    });
  };

  handleMinDateChange: Function = (mindate: string): void => {
    const date = formatDate(mindate);

    this.setState({ mindate: moment(date).format(DATE_FORMATS.URL_FORMAT) });
  };

  handleMaxDateChange: Function = (maxdate: string): void => {
    this.setState({ maxdate });
  };

  handleFilterChange: Function = (value: Array<string>): void => {
    this.setState({ filter: value[0] === 'All' ? '' : value.join(',') });
  };

  handleIdsChange: Function = (value: Array<string>): void => {
    this.setState({ ids: value.join(',') });
  };

  handleNameChange: Function = (event: EventHandler): void => {
    this.setState({ name: event.target.value });
  };

  handleErrorChange: Function = (event: EventHandler): void => {
    this.setState({ error: event.target.value });
  };

  handleRetryChange: Function = (): void => {
    this.setState({ retry: !this.state.retry || this.state.retry === '' ? 'true' : '' });
  };

  handleBuserrChange: Function = (): void => {
    this.setState({ busErr: !this.state.busErr || this.state.busErr === '' ? 'true' : '' });
  };

  render() {
    return (
      <Toolbar>
        <div className="pull-left">
          <div className="form-group search-toolbar">
            <div className="pull-left">
              <Dropdown
                id="ids"
                multi
                onSubmit={this.handleIdsChange}
                selected={!this.state.ids || this.state.ids === '' ?
                  [] :
                  this.state.ids.split(',')
                }
              >
                <Control />
                {this.props.workflows.map((o, k) => (
                  <Item key={k} title={o} />
                ))}
              </Dropdown>
            </div>
            <div className="pull-left">
              <input
                className="form-control search-input"
                type="text"
                placeholder="Name"
                onChange={this.handleNameChange}
                value={this.state.name || ''}
                id="name"
              />
            </div>
            <div className="pull-left">
              <input
                className="form-control search-input"
                type="text"
                placeholder="Error"
                onChange={this.handleErrorChange}
                value={this.state.error || ''}
                id="error"
              />
            </div>
            <div className="pull-left">
              <Datepicker
                placeholder="Min date..."
                date={this.state.mindate}
                onApplyDate={this.handleMinDateChange}
                applyOnBlur
                id="mindate"
              />
            </div>
            <div className="pull-left">
              <Datepicker
                placeholder="Max date..."
                date={this.state.maxdate}
                onApplyDate={this.handleMaxDateChange}
                applyOnBlur
                noButtons
                id="maxdate"
              />
            </div>
            <Dropdown
              id="filters"
              multi
              def="All"
              onSubmit={this.handleFilterChange}
              selected={!this.state.filter || this.state.filter === '' ?
                ['All'] :
                this.state.filter.split(',')
              }
            >
              <Control />
              <Item title="All" />
              {ORDER_STATES.map((o, k) => (
                <Item key={k} title={o.title} />
              ))}
            </Dropdown>
            <div className="pull-left">
              <Controls noControls grouped>
                <Button
                  label="Retry"
                  btnStyle={this.state.retry ? 'success' : 'default'}
                  icon={this.state.retry ? 'check-square-o' : 'square-o'}
                  big
                  action={this.handleRetryChange}
                />
                <Button
                  label="Bus. Err."
                  btnStyle={this.state.busErr ? 'success' : 'default'}
                  icon={this.state.busErr ? 'check-square-o' : 'square-o'}
                  big
                  action={this.handleBuserrChange}
                />
              </Controls>
            </div>
          </div>
        </div>
        <div className="pull-right">
          <Controls noControls grouped>
            <Button
              label="Save search"
              icon="save"
              btnStyle="success"
              big
              action={this.handleSaveClick}
            />
            <Button
              label="Show history"
              icon="history"
              btnStyle="default"
              big
              action={this.handleHistoryClick}
            />
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
