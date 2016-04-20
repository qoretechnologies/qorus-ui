import React, { Component, PropTypes } from 'react';
import { pureRender } from '../utils';
import { debounce } from 'lodash';

@pureRender
export default class extends Component {
  static propTypes = {
    onSearchUpdate: PropTypes.func,
    defaultValue: PropTypes.string,
  };

  componentWillMount() {
    this.delayedSearch = debounce((event) => {
      this.props.onSearchUpdate(event.target.value);
    }, 500);

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

  render() {
    return (
      <div className="input-group col-lg-3 pull-right">
        <input
          type="text"
          className="form-control"
          onChange={this.handleInputChange}
          value={this.state.query}
        />
        <span className="input-group-addon">
          <i className="fa fa-search" />
        </span>
      </div>
    );
  }
}
