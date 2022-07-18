// @flow
import { ControlGroup, InputGroup, Intent } from '@blueprintjs/core';
import debounce from 'lodash/debounce';
import moment from 'moment';
import { Component } from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import { Control as Button, Controls as ButtonGroup } from '../../../components/controls';
import Datepicker from '../../../components/datepicker';
import Dropdown, { Control, Item } from '../../../components/dropdown';
import Pull from '../../../components/Pull';
import { DATE_FORMATS } from '../../../constants/dates';
import { INTERFACE_ICONS } from '../../../constants/interfaces';
import { ORDER_STATES } from '../../../constants/orders';
import { formatDate } from '../../../helpers/date';

type Props = {
  mindateQuery: string;
  changeMindateQuery: Function;
  maxdateQuery: string;
  changeMaxdateQuery: Function;
  filterQuery: string;
  changeFilterQuery: Function;
  idsQuery: string;
  changeIdsQuery: Function;
  nameQuery: string;
  changeNameQuery: Function;
  errorQuery: string;
  changeErrorQuery: Function;
  retryQuery: string;
  changeRetryQuery: Function;
  busErrQuery: string;
  changeBuserrQuery: Function;
  changeAllQuery: Function;
  defaultDate: string;
  workflows: Array<string>;
  allQuery: string;
  username: string;
  openModal: Function;
  closeModal: Function;
  saveSearch: Function;
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
  props: Props = this.props;

  state: {
    mindate: string;
    maxdate: string;
    filter: string;
    ids: string;
    name: string;
    error: string;
    retry: string;
    busErr: string;
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

  public _isMounted = false;
  public set isMounted(mounted: boolean) {
    this._isMounted = mounted;
  }

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

  componentDidMount(): void {
    this.isMounted = true;
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  _delayedSearch: Function = debounce((data: any) => {
    if (this._isMounted) {
      this.props.changeAllQuery(data);
    }
  }, 280);

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

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleNameChange: Function = (event: EventHandler): void => {
    this.setState({ name: event.target.value });
  };

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleErrorChange: Function = (event: EventHandler): void => {
    this.setState({ error: event.target.value });
  };

  handleRetryChange: Function = (): void => {
    this.setState({
      retry: !this.state.retry || this.state.retry === '' ? 'true' : '',
    });
  };

  handleBuserrChange: Function = (): void => {
    this.setState({
      busErr: !this.state.busErr || this.state.busErr === '' ? 'true' : '',
    });
  };

  render() {
    return (
      <Pull>
        <ButtonGroup>
          <ControlGroup>
            <InputGroup
              type="text"
              placeholder="Name"
              // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
              onChange={this.handleNameChange}
              value={this.state.name || ''}
              id="name"
            />
            <InputGroup
              type="text"
              placeholder="Error"
              // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
              onChange={this.handleErrorChange}
              value={this.state.error || ''}
              id="error"
            />
          </ControlGroup>
        </ButtonGroup>
        <ButtonGroup>
          <Datepicker
            placeholder="Min date..."
            date={this.state.mindate}
            // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
            onApplyDate={this.handleMinDateChange}
            applyOnBlur
            id="mindate"
          />
        </ButtonGroup>
        <ButtonGroup>
          <Datepicker
            placeholder="Max date..."
            date={this.state.maxdate}
            // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
            onApplyDate={this.handleMaxDateChange}
            applyOnBlur
            noButtons
            id="maxdate"
          />
        </ButtonGroup>
        <ButtonGroup>
          <Dropdown
            id="ids"
            multi
            submitOnBlur
            // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
            onSubmit={this.handleIdsChange}
            selected={!this.state.ids || this.state.ids === '' ? [] : this.state.ids.split(',')}
          >
            {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ icon: string; }' is missing the following ... Remove this comment to see the full error message */}
            <Control icon={INTERFACE_ICONS.workflow} />
            {this.props.workflows.map((o, k) => (
              // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
              <Item key={k} title={o} />
            ))}
          </Dropdown>
        </ButtonGroup>
        <ButtonGroup>
          <Dropdown
            id="filters"
            multi
            def="All"
            submitOnBlur
            // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
            onSubmit={this.handleFilterChange}
            selected={
              !this.state.filter || this.state.filter === ''
                ? ['All']
                : this.state.filter.split(',')
            }
          >
            {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ icon: string; }' is missing the following ... Remove this comment to see the full error message */}
            <Control icon="info-sign" />
            {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
            <Item title="All" />
            {ORDER_STATES.map((o, k) => (
              // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
              <Item key={k} title={o.title} />
            ))}
          </Dropdown>
        </ButtonGroup>
        <ButtonGroup>
          <Button
            icon="refresh"
            intent={this.state.retry ? Intent.PRIMARY : Intent.NONE}
            onClick={this.handleRetryChange}
            big
          />
          <Button
            icon="error"
            intent={this.state.busErr ? Intent.PRIMARY : Intent.NONE}
            onClick={this.handleBuserrChange}
            big
          />
        </ButtonGroup>
        <ButtonGroup>
          <Button text="Clear" icon="cross" onClick={this.handleClearClick} big />
        </ButtonGroup>
      </Pull>
    );
  }
}
