// @flow
import React, { Component } from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import debounce from 'lodash/debounce';
import omit from 'lodash/omit';

import Toolbar from '../../components/toolbar';
import Datepicker from '../../components/datepicker';
import { Controls, Control as Button } from '../../components/controls';

type Props = {
  mindateQuery: string,
  changeMindateQuery: Function,
  maxdateQuery: string,
  changeMaxdateQuery: Function,
  statusQuery: string,
  changeStatusQuery: Function,
  idsQuery: string,
  changeIdsQuery: Function,
  keynameQuery: string,
  changeKeynameQuery: Function,
  keyvalueQuery: string,
  changeKeyvalueQuery: Function,
  changeAllQuery: Function,
  defaultDate: string,
};

@pure([
  'mindateQuery',
  'maxdateQuery',
  'statusQuery',
  'keyvalueQuery',
  'keynameQuery',
  'idsQuery',
])
export default class SearchToolbar extends Component {
  props: Props;

  state: {
    mindate: string,
    maxdate: string,
    status: string,
    ids: string,
    keyname: string,
    keyvalue: string,
    showAdvanced: boolean,
  } = {
    mindate: this.props.mindateQuery,
    maxdate: this.props.maxdateQuery,
    status: this.props.statusQuery,
    ids: this.props.idsQuery,
    keyname: this.props.keynameQuery,
    keyvalue: this.props.keyvalueQuery,
    showAdvanced: !!(this.props.statusQuery || this.props.maxdateQuery),
  };

  componentDidUpdate(prevProps: Object, prevState: Object) {
    if (omit(prevState, ['showAdvanced']) !== omit(this.state, ['showAdvanced'])) {
      this._delayedSearch(omit(this.state, ['showAdvanced']));
    }
  }

  _delayedSearch: Function = debounce((data: Object) => {
    this.props.changeAllQuery(data);
  }, 280);

  handleAdvancedClick: Function = (): void => {
    if (this.state.showAdvanced) {
      this.setState({
        maxdate: '',
        status: '',
        showAdvanced: false,
      });
    } else {
      this.setState({
        showAdvanced: true,
      });
    }
  };

  handleClearClick: Function = (): void => {
    this.setState({
      mindate: this.props.defaultDate,
      maxdate: '',
      status: '',
      ids: '',
      keyname: '',
      keyvalue: '',
    });
  };

  handleMinDateChange: Function = (mindate: string): void => {
    this.setState({ mindate });
  };

  handleMaxDateChange: Function = (maxdate: string): void => {
    this.setState({ maxdate });
  };

  handleStatusChange: Function = (event: EventHandler): void => {
    this.setState({ status: event.target.value });
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
      <Toolbar>
        <div className="pull-left">
          <div className="form-group search-toolbar">
            <div className="pull-left">
              <input
                className="form-control search-input"
                type="text"
                placeholder="Instance ID..."
                onChange={this.handleIdsChange}
                value={this.state.ids || ''}
                id="instance-id"
              />
            </div>
            <div className="pull-left">
              <input
                className="form-control search-input"
                type="text"
                placeholder="Keyname"
                onChange={this.handleKeynameChange}
                value={this.state.keyname || ''}
                id="keyname"
              />
            </div>
            <div className="pull-left">
              <input
                className="form-control search-input"
                type="text"
                placeholder="Keyvalue"
                onChange={this.handleKeyvalueChange}
                value={this.state.keyvalue || ''}
                id="keyvalue"
              />
            </div>
            <div className="pull-left">
              <Datepicker
                placeholder="Min date..."
                date={this.state.mindate}
                onApplyDate={this.handleMinDateChange}
                applyOnBlur
                noButtons
                id="mindate"
              />
            </div>
            {this.state.showAdvanced && (
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
            )}
            {this.state.showAdvanced && (
              <div className="pull-left">
                <input
                  className="form-control search-input"
                  type="text"
                  placeholder="Status..."
                  onChange={this.handleStatusChange}
                  value={this.state.status || ''}
                  id="status"
                />
              </div>
            )}
          </div>
        </div>
        <div className="pull-right">
          <Controls noControls grouped>
            <Button
              label="Advanced search"
              icon={this.state.showAdvanced ? 'check-square-o' : 'square-o'}
              btnStyle={this.state.showAdvanced ? 'success' : 'default'}
              big
              action={this.handleAdvancedClick}
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
