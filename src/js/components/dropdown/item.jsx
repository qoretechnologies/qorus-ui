import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Item extends Component {
  static propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    icon: PropTypes.string,
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

  /**
   * Renders the icon for the dropdown item
   * @returns {ReactElement|Void}
   */
  renderIcon() {
    if (this.props.icon) {
      return <i className={classNames('fa', `fa-${this.props.icon}`)} />;
    }

    return null;
  }
  
  render() {
    return (
      <li>
        <a
          onClick={::this.onItemClick}
          href="#"
        >
          {this.renderIcon()}
          {' '}
          {this.props.title}
        </a>
      </li>
    );
  }
}
