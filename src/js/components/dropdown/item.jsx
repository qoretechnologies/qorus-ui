import React, { Component, PropTypes } from 'react';

export default class Item extends Component {
  static propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    action: PropTypes.func,
    hideDropdown: PropTypes.func,
  };

  /**
   * Hides the dropdown and runs
   * provided function
   */
  onItemClick() {
    this.props.action();
    this.props.hideDropdown();
  }
  
  render() {
    return (
      <li>
        <a
          onClick={::this.onItemClick}
          href="#"
        >{this.props.title}</a>
      </li>
    );
  }
}
