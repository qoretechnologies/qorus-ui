/* @flow */
import React from 'react';
import { isActive } from '../../helpers/router';
import { RelativeLink } from 'react-router-relative-links';

export default class NavLink extends RelativeLink {
  props: {
    to: string,
    path?: string,
  } = this.props;

  render() {
    return (
      <li
        role="tab"
        className="bp3-tab"
        aria-selected={isActive(this.props.to, this.props.path)}
      >
        {this.props.to}
      </li>
    );
  }
}
