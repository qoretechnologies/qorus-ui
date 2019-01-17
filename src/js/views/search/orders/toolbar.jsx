// @flow
import React, { Component } from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import debounce from 'lodash/debounce';
import moment from 'moment';
import { ControlGroup, InputGroup } from '@blueprintjs/core';

import Datepicker from '../../../components/datepicker';
import Dropdown, { Item, Control } from '../../../components/dropdown';
import { ORDER_STATES } from '../../../constants/orders';
import { formatDate } from '../../../helpers/date';
import { DATE_FORMATS } from '../../../constants/dates';
import HistoryModal from '../modals/history';
import Pull from '../../../components/Pull';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../../components/controls';

type Props = {
  mindateQuery: string,
  changeMindateQuery: Function,
  maxdateQuery: string,
  changeMaxdateQuery: Function,
  filterQuery: string,
  changeFilterQuery: Function,
  idsQuery: string,
  changeIdsQuery: Function,
  keynameQuery: string,
  changeKeynameQuery: Function,
  keyvalueQuery: string,
  changeKeyvalueQuery: Function,
  changeAllQuery: Function,
  allQuery: string,
  defaultDate: string,
  saveSearch: Function,
  username: string,
  openModal: Function,
  closeModal: Function,
};

@pure([
  'mindateQuery',
  'maxdateQuery',
  'filterQuery',
  'keyvalueQuery',
  'keynameQuery',
  'idsQuery',
])
export default class SearchToolbar extends Component {
  props: Props = this.props;

  state: {
    mindate: string,
    maxdate: string,
    filter: string,
    ids: string,
    keyname: string,
    keyvalue: string,
  } = {
    mindate: this.props.mindateQuery,
    maxdate: this.props.maxdateQuery,
    filter: this.props.filterQuery,
    ids: this.props.idsQuery,
    keyname: this.props.keynameQuery,
    keyvalue: this.props.keyvalueQuery,
  };

  componentWillReceiveProps(nextProps: Props) {
    if (this.props !== nextProps) {
      this.setState({
        mindate: nextProps.mindateQuery,
        maxdate: nextProps.maxdateQuery,
        filter: nextProps.filterQuery,
        ids: nextProps.idsQuery,
        keyname: nextProps.keynameQuery,
        keyvalue: nextProps.keyvalueQuery,
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
      <HistoryModal type="orderSearch" onClose={this.props.closeModal} />
    );
  };

  handleSaveClick: Function = (): void => {
    this.props.saveSearch(
      'orderSearch',
      this.props.allQuery,
      this.props.username
    );
  };

  handleClearClick: Function = (): void => {
    this.setState({
      mindate: this.props.defaultDate,
      maxdate: '',
      filter: '',
      ids: '',
      keyname: '',
      keyvalue: '',
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

  handleIdsChange: Function = (event: EventHandler): void => {
    this.setState({ ids: event.target.value });
  };

  handleKeynameChange: Function = (event: EventHandler): void => {
    this.setState({ keyname: event.target.value });
  };

  handleKeyvalueChange: Function = (event: EventHandler): void => {
    this.setState({ keyvalue: event.target.value });
  };

  render() {
    return (
      <div>
        <Pull>
          <ButtonGroup>
            <ControlGroup className="vab">
              <InputGroup
                type="text"
                placeholder="Workflow Order ID..."
                onChange={this.handleIdsChange}
                value={this.state.ids || ''}
                id="instance-id"
              />
              <InputGroup
                type="text"
                placeholder="Keyname"
                onChange={this.handleKeynameChange}
                value={this.state.keyname || ''}
                id="keyname"
              />
              <InputGroup
                type="text"
                placeholder="Keyvalue"
                onChange={this.handleKeyvalueChange}
                value={this.state.keyvalue || ''}
                id="keyvalue"
              />
            </ControlGroup>
          </ButtonGroup>
          <ButtonGroup>
            <Datepicker
              placeholder="Min date..."
              date={this.state.mindate}
              onApplyDate={this.handleMinDateChange}
              applyOnBlur
              id="mindate"
            />
          </ButtonGroup>
          <ButtonGroup>
            <Datepicker
              placeholder="Max date..."
              date={this.state.maxdate}
              onApplyDate={this.handleMaxDateChange}
              applyOnBlur
              noButtons
              id="maxdate"
            />
          </ButtonGroup>
          <ButtonGroup>
            <Dropdown
              id="filters"
              multi
              def="All"
              submitOnBlur
              onSubmit={this.handleFilterChange}
              selected={
                !this.state.filter || this.state.filter === ''
                  ? ['All']
                  : this.state.filter.split(',')
              }
            >
              <Control iconName="filter-list" />
              <Item title="All" />
              {ORDER_STATES.map((o, k) => (
                <Item key={k} title={o.title} />
              ))}
            </Dropdown>
          </ButtonGroup>
          <ButtonGroup>
            <Button
              text="Clear"
              iconName="cross"
              onClick={this.handleClearClick}
              big
            />
          </ButtonGroup>
        </Pull>
      </div>
    );
  }
}
