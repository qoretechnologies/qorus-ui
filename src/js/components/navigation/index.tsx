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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'pathname' does not exist on type 'Object... Remove this comment to see the full error message
      !!this.props.location.pathname &&
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'pathname' does not exist on type 'Object... Remove this comment to see the full error message
      this.props.location.pathname.indexOf(url) === 0
    );
  }

  /**
   * Renders navigation item and checks if it is active.
   *
   * @param {object} item
   * @return {ReactElement}
   */
  // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  renderItem: Function = (item: Object): React.Element<any> => (
    <Item
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'url' does not exist on type 'Object'.
      key={item.url}
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'Object' is not assignable to par... Remove this comment to see the full error message
      active={this.isActiveItem(item)}
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'url' does not exist on type 'Object'.
      url={item.url}
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
      name={item.name}
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'icon' does not exist on type 'Object'.
      icon={item.icon}
    />
  );

  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  render(): React.Element<any> {
    return (
      <nav className="side-menu pull-left">
        <ul className="nav nav-pills nav-stacked side-menu__main">
          { /* @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'Function' is not assignable to p... Remove this comment to see the full error message */ }
          {this.props.mainItems.map(this.renderItem)}
        </ul>
        <ul className="side-menu__extra">
          { /* @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'Function' is not assignable to p... Remove this comment to see the full error message */ }
          {this.props.extraItems.map(this.renderItem)}
        </ul>
      </nav>
    );
  }
}
