import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { pureRender } from '../utils';

@pureRender
export default class Item extends Component {
  static propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    icon: PropTypes.string,
    action: PropTypes.func,
    hideDropdown: PropTypes.func,
    multi: PropTypes.bool,
    selected: PropTypes.bool,
    toggleItem: PropTypes.func,
  };

  /**
   * Hides the dropdown and runs
   * provided function
   * @params {Object} - browser Event
   */
  handleClick = (event) => {
    if (this.props.action) {
      this.props.action(event, this.props.title);
    }

    if (!this.props.multi) {
      this.props.hideDropdown();
    } else {
      this.props.toggleItem(this.props.title);
    }
  };

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
    const cls = classNames(this.props.selected ? 'active' : '');

    return (
      <li className={cls}>
        <a
          onClick={this.handleClick}
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
