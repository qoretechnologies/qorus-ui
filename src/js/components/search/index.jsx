/* @flow */
import React, { Component } from 'react';
import { pureRender } from '../utils';
import { debounce, includes } from 'lodash';
import {
  Button,
  Menu,
  MenuItem,
  Position,
  InputGroup,
  ControlGroup,
  Classes,
} from '@blueprintjs/core';

import Dropdown, { Item, Control } from '../dropdown';
import { injectIntl } from 'react-intl';

@pureRender
@injectIntl
export default class Search extends Component {
  props: {
    onSearchUpdate: Function,
    defaultValue?: ?string,
    pullLeft?: boolean,
    searches?: Array<string>,
  } = this.props;

  state: {
    query: string,
    history: boolean,
  } = {
    query: this.props.defaultValue || '',
    history: false,
  };

  _input: any;

  componentWillReceiveProps(nextProps: Object) {
    if (this.props.defaultValue !== nextProps.defaultValue) {
      this.setState({
        query: nextProps.defaultValue || '',
      });
    }
  }

  delayedSearch: Function = debounce((value: string): void => {
    this.props.onSearchUpdate(value, false);
  }, 1000);

  /**
   * Handles input changes, event is persisted
   * and the search is performed after a debounce
   * timeout
   *
   * @see componentWillMount
   * @param {Event} event
   */
  handleInputChange: Function = (event: EventHandler): void => {
    event.persist();

    const { value } = event.target;
    const hit = this.props.searches
      ? this.props.searches.filter(
          (qry: string): boolean => includes(qry, value) && value !== qry
        )
      : false;

    this.setState({
      query: value,
      history: value && value.length >= 2 && hit && hit.length > 0,
    });

    this.delayedSearch(value);
  };

  handleFormSubmit: Function = (event: EventHandler): void => {
    event.preventDefault();

    this.setState({
      history: false,
    });

    this.props.onSearchUpdate(this.state.query, true);
  };

  handleClearClick: Function = (): void => {
    this.setState({
      query: '',
    });

    this.props.onSearchUpdate('');
  };

  handleHistoryClick: Function = (event: EventHandler): void => {
    const query = event.target.textContent;

    this.setState({
      query,
      history: false,
    });

    this.delayedSearch(query);
  };

  renderHistoryItems: Function = (): ?Array<React.Element<any>> => {
    if (!this.props.searches) return null;

    const searches: Array<string> = this.props.searches.filter(
      (qry: string): boolean =>
        includes(qry, this.state.query) && this.state.query !== qry
    );

    return searches.map(
      (qry: string, index: number): React.Element<any> => (
        <Item
          key={`${qry}_${index}`}
          title={qry}
          onClick={this.handleHistoryClick}
        />
      )
    );
  };

  handleRef: Function = (ref: any): void => {
    if (ref) {
      this._input = ref;

      if (this.props.focusOnMount) {
        this._input.focus();
      }
    }
  };

  render() {
    const { searches } = this.props;

    return (
      <form
        onSubmit={this.handleFormSubmit}
        className={`${this.props.pullLeft ? '' : 'pull-right'}`}
      >
        <ControlGroup>
          {searches && searches.length !== 0 ? (
            <Dropdown>
              <Control iconName="history" noCaret />
              {this.renderHistoryItems()}
            </Dropdown>
          ) : null}
          <InputGroup
            inputRef={this.handleRef}
            type="text"
            id="search"
            onChange={this.handleInputChange}
            value={this.state.query}
            autoComplete="off"
            placeholder={this.props.intl.formatMessage({ id: 'component.search' })}
            rightElement={
              this.state.query && (
                <Button
                  className={Classes.MINIMAL}
                  type="button"
                  iconName="cross"
                  onClick={this.handleClearClick}
                />
              )
            }
          />
          <Button type="submit" iconName="search" />
        </ControlGroup>
      </form>
    );
  }
}
