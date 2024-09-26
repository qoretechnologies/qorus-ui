// @flow
import { ControlGroup, InputGroup } from '@blueprintjs/core';
import { isEqual } from 'lodash';
import debounce from 'lodash/debounce';
import moment from 'moment';
import { Component } from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import Pull from '../../../components/Pull';
import { Control as Button, Controls as ButtonGroup } from '../../../components/controls';
import Datepicker from '../../../components/datepicker';
import Dropdown, { Control, Item } from '../../../components/dropdown';
import { DATE_FORMATS } from '../../../constants/dates';
import { ORDER_STATES } from '../../../constants/orders';
import { formatDate } from '../../../helpers/date';
import HistoryModal from '../modals/history';

type Props = {
  mindateQuery: string;
  changeMindateQuery: Function;
  maxdateQuery: string;
  changeMaxdateQuery: Function;
  filterQuery: string;
  changeFilterQuery: Function;
  idsQuery: string;
  changeIdsQuery: Function;
  keynameQuery: string;
  changeKeynameQuery: Function;
  keyvalueQuery: string;
  changeKeyvalueQuery: Function;
  changeAllQuery: Function;
  allQuery: string;
  defaultDate: string;
  saveSearch: Function;
  username: string;
  openModal: Function;
  closeModal: Function;
};

@pure(['mindateQuery', 'maxdateQuery', 'filterQuery', 'keyvalueQuery', 'keynameQuery', 'idsQuery'])
export default class SearchToolbar extends Component {
  props: Props = this.props;

  state: {
    mindate: string;
    maxdate: string;
    filter: string;
    ids: string;
    keyname: string;
    keyvalue: string;
  } = {
    mindate: this.props.mindateQuery,
    maxdate: this.props.maxdateQuery,
    filter: this.props.filterQuery,
    ids: this.props.idsQuery,
    keyname: this.props.keynameQuery,
    keyvalue: this.props.keyvalueQuery,
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
        keyname: nextProps.keynameQuery,
        keyvalue: nextProps.keyvalueQuery,
      });
    }
  }

  // Check if the component should update
  shouldComponentUpdate(nextProps: Readonly<{}>, nextState: Readonly<{}>): boolean {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
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
    console.log('searching', data);
    if (this._isMounted) {
      this.props.changeAllQuery(data);
    }
  }, 400);

  handleHistoryClick: Function = (): void => {
    this.props.openModal(<HistoryModal type="orderSearch" onClose={this.props.closeModal} />);
  };

  handleSaveClick: Function = (): void => {
    this.props.saveSearch('orderSearch', this.props.allQuery, this.props.username);
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

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleIdsChange: Function = (event: EventHandler): void => {
    this.setState({ ids: event.target.value });
  };

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleKeynameChange: Function = (event: EventHandler): void => {
    this.setState({ keyname: event.target.value });
  };

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
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
                // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
                onChange={this.handleIdsChange}
                value={this.state.ids || ''}
                id="instance-id"
              />
              <InputGroup
                type="text"
                placeholder="Keyname"
                // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
                onChange={this.handleKeynameChange}
                value={this.state.keyname || ''}
                id="keyname"
              />
              <InputGroup
                type="text"
                placeholder="Keyvalue"
                // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
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
              <Control icon="filter-list" />
              {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
              <Item title="All" />
              {ORDER_STATES.map((o, k) => (
                // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
                <Item key={k} title={o.title} />
              ))}
            </Dropdown>
          </ButtonGroup>
          <ButtonGroup>
            <Button text="Clear" icon="cross" onClick={this.handleClearClick} big />
          </ButtonGroup>
        </Pull>
      </div>
    );
  }
}
