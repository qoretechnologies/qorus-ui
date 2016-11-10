/* @flow */
import React, { Component } from 'react';
import { pureRender } from '../utils';
import { debounce } from 'lodash';

import { Control as Button } from '../controls';

@pureRender
export default class Search extends Component {
  props: {
    onSearchUpdate: Function,
    defaultValue?: ?string,
    pullLeft?: boolean,
  };

  state: {
    query: string,
  } = {
    query: this.props.defaultValue || '',
  };

  componentWillReceiveProps(nextProps: Object) {
    if (this.props.defaultValue !== nextProps.defaultValue) {
      this.setState({
        query: nextProps.defaultValue || '',
      });
    }
  }

  delayedSearch: Function = debounce((event: EventHandler): void => {
    this.props.onSearchUpdate(event.target.value);
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

    this.setState({
      query: event.target.value,
    });

    this.delayedSearch(event);
  };

  handleFormSubmit: Function = (event: EventHandler): void => {
    event.preventDefault();

    this.props.onSearchUpdate(this.state.query);
  };

  handleClearClick: Function = (): void => {
    this.setState({
      query: '',
    });

    this.props.onSearchUpdate('');
  };

  render() {
    return (
      <form
        onSubmit={this.handleFormSubmit}
        id="search-form"
        className={`col-lg-3 ${this.props.pullLeft ? '' : 'pull-right'}`}
      >
        <div className="input-group">
          <input
            ref="input"
            type="text"
            id="search"
            className="form-control"
            onChange={this.handleInputChange}
            value={this.state.query}
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
