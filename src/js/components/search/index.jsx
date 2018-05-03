/* @flow */
import React, { Component } from 'react';
import { pureRender } from '../utils';
import { debounce, includes } from 'lodash';

import { Control as Button } from '../controls';
import Icon from '../icon';
import Dropdown, { Item, Control } from '../dropdown';

@pureRender
export default class Search extends Component {
  props: {
    onSearchUpdate: Function,
    defaultValue?: ?string,
    pullLeft?: boolean,
    searches?: Array<string>,
  };

  state: {
    query: string,
    history: boolean,
  } = {
    query: this.props.defaultValue || '',
    history: false,
  };

  componentWillReceiveProps(nextProps: Object) {
    if (this.props.defaultValue !== nextProps.defaultValue) {
      this.setState({
        query: nextProps.defaultValue || '',
      });
    }
  }

  delayedSearch: Function = debounce((value: string): void => {
    this.props.onSearchUpdate(value, false);
  }, 280);

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
    const hit = this.props.searches ? this.props.searches.filter((qry: string): boolean => (
      includes(qry, value) && value !== qry
    )) : false;

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

  handleHistoryClick: Function = (event: EventHandler, query: string): void => {
    this.setState({
      query,
      history: false,
    });

    this.delayedSearch(query);
  }

  renderHistoryItems: Function = (): ?Array<React.Element<any>> => {
    if (!this.props.searches) return null;

    const searches: Array<string> = this.props.searches.filter((qry: string): boolean => (
      includes(qry, this.state.query) && this.state.query !== qry
    ));

    return searches.map((qry: string, index: number): React.Element<any> => (
      <Item
        key={`${qry}_${index}`}
        title={qry}
        action={this.handleHistoryClick}
      />
    ));
  }

  render() {
    const { searches } = this.props;

    return (
      <form
        onSubmit={this.handleFormSubmit}
        id="search-form"
        className={`col-sm-3 ${this.props.pullLeft ? '' : 'pull-right'}`}
      >
        <div className="input-group">
          {(searches && searches.length !== 0) && (
            <div className="input-group-btn">
              <Dropdown
                show={this.state.history}
              >
                <Control>
                  <Icon icon="history" />
                </Control>
                {this.renderHistoryItems()}
              </Dropdown>
            </div>
          )}
          <input
            ref="input"
            type="text"
            id="search"
            className="form-control"
            onChange={this.handleInputChange}
            value={this.state.query}
            autoComplete="off"
          />
          <div className="input-group-btn">
            <Button
              type="button"
              big
              icon="times"
              onClick={this.handleClearClick}
            />
            <Button
              type="submit"
              icon="search"
              btnStyle="default"
              big
            />
          </div>
        </div>
      </form>
    );
  }
}
