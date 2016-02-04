import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';


import { pureRender } from '../utils';


/**
 * Navigation item with icon and text.
 *
 * Item can be marked as active. Hyperlink is created via React
 * Router's `Link` component.
 */
@pureRender
export default class Item extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string,
    active: PropTypes.bool,
  };


  static defaultProps = {
    active: false,
  };


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <li
        role="presentation"
        className={classNames({
          active: this.props.active,
        })}
      >
        <Link to={this.props.url}>
          <i
            className={classNames(
              'side-menu__icon',
              'fa',
              'fa-2x',
              this.props.icon
            )}
          />
          <span className="side-menu__text">{this.props.name}</span>
        </Link>
      </li>
    );
  }
}
