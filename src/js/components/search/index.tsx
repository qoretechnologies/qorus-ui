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
    // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
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
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'defaultValue' does not exist on type 'Ob... Remove this comment to see the full error message
    if (this.props.defaultValue !== nextProps.defaultValue) {
      this.setState({
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'defaultValue' does not exist on type 'Ob... Remove this comment to see the full error message
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
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
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

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
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

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleHistoryClick: Function = (event: EventHandler): void => {
    const query = event.target.textContent;

    this.setState({
      query,
      history: false,
    });

    this.delayedSearch(query);
  };

  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  renderHistoryItems: Function = (): ?Array<React.Element<any>> => {
    if (!this.props.searches) return null;

    const searches: Array<string> = this.props.searches.filter(
      (qry: string): boolean =>
        includes(qry, this.state.query) && this.state.query !== qry
    );

    return searches.map(
      // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
      (qry: string, index: number): React.Element<any> => (
        <Item
          key={`${qry}_${index}`}
          title={qry}
          // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
          onClick={this.handleHistoryClick}
        />
      )
    );
  };

  handleRef: Function = (ref: any): void => {
    if (ref) {
      this._input = ref;

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'focusOnMount' does not exist on type '{ ... Remove this comment to see the full error message
      if (this.props.focusOnMount) {
        this._input.focus();
      }
    }
  };

  render() {
    const { searches } = this.props;

    return (
      <form
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
        onSubmit={this.handleFormSubmit}
        className={`${this.props.pullLeft ? '' : 'pull-right'}`}
      >
        <ControlGroup>
          {searches && searches.length !== 0 ? (
            // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
            <Dropdown>
              { /* @ts-expect-error ts-migrate(2739) FIXME: Type '{ icon: string; noCaret: true; }' is missing... Remove this comment to see the full error message */ }
              <Control icon="history" noCaret />
              {this.renderHistoryItems()}
            </Dropdown>
          ) : null}
          <InputGroup
            // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'IRef<HT... Remove this comment to see the full error message
            inputRef={this.handleRef}
            type="text"
            id="search"
            // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
            onChange={this.handleInputChange}
            value={this.state.query}
            autoComplete="off"
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ onSearch... Remove this comment to see the full error message
            placeholder={this.props.intl.formatMessage({ id: 'component.search' })}
            rightElement={
              this.state.query && (
                <Button
                  className={Classes.MINIMAL}
                  type="button"
                  icon="cross"
                  // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type '((event... Remove this comment to see the full error message
                  onClick={this.handleClearClick}
                />
              )
            }
          />
          <Button type="submit" icon="search" />
        </ControlGroup>
      </form>
    );
  }
}
