import React, { Component, PropTypes } from 'react';
import { pureRender } from '../utils';
import { debounce } from 'lodash';

import { Control } from '../controls';

@pureRender
export default class Search extends Component {
  componentWillMount() {
    this.delayedSearch = debounce((event) => {
      this.props.onSearchUpdate(event.target.value);
    }, 280);

    this.setState({
      query: this.props.defaultValue,
    });
  }

  componentWillReceiveProps(next) {
    if (this.props.defaultValue !== next.defaultValue) {
      this.setState({
        query: next.defaultValue,
      });
    }
  }

  /**
   * Handles input changes, event is persisted
   * and the search is performed after a debounce
   * timeout
   *
   * @see componentWillMount
   * @param {Event} event
   */
  handleInputChange = (event) => {
    event.persist();

    this.setState({
      query: event.target.value,
    });

    this.delayedSearch(event);
  };

  handleFormSubmit = (event) => {
    event.preventDefault();

    this.props.onSearchUpdate(this.state.query);
  };

  render() {
    return (
      <form
        onSubmit={this.handleFormSubmit}
        id="search-form"
      >
        <div className={`input-group col-lg-2 ${this.props.pullLeft ? '' : 'pull-right'}`}>
          <input
            ref="input"
            type="text"
            id="search"
            className="form-control"
            onChange={this.handleInputChange}
            defaultValue={this.state.query}
          />
          <span className="input-group-addon">
            <i className="fa fa-search" />
          </span>
        </div>
        <Control
          type="submit"
          css={{ display: 'none' }}
        />
      </form>
    );
  }
}

Search.propTypes = {
  onSearchUpdate: PropTypes.func,
  defaultValue: PropTypes.string,
  pullLeft: PropTypes.bool,
};
