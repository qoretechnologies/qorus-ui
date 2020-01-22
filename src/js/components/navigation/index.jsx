/* @flow */
import React, { Component } from 'react';
import { pureRender } from '../utils';

import Item from './item';

/**
 * Vertical navigation on the side.
 *
 * There are two types of items: main and extra. Location object from
 * React Router can be passed to detect currently active item.
 */
@pureRender
export default class Navigation extends Component {
  static defaultProps = {
    location: { pathname: '' },
    mainItems: [],
    extraItems: [],
  };

  props: {
    location: Object,
    mainItems: Array<any>,
    extraItems: Array<any>,
  } = this.props;

  /**
   * Checks if given item URL is base for current location.
   *
   * @param {string} url
   * @return {boolean}
   */
  isActiveItem({ url }: { url: string }): boolean {
    return (
      !!this.props.location.pathname &&
      this.props.location.pathname.indexOf(url) === 0
    );
  }

  /**
   * Renders navigation item and checks if it is active.
   *
   * @param {object} item
   * @return {ReactElement}
   */
  renderItem: Function = (item: Object): React.Element<any> => (
    <Item
      key={item.url}
      active={this.isActiveItem(item)}
      url={item.url}
      name={item.name}
      icon={item.icon}
    />
  );

  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render(): React.Element<any> {
    return (
      <nav className="side-menu pull-left">
        <ul className="nav nav-pills nav-stacked side-menu__main">
          {this.props.mainItems.map(this.renderItem)}
        </ul>
        <ul className="side-menu__extra">
          {this.props.extraItems.map(this.renderItem)}
        </ul>
      </nav>
    );
  }
}
