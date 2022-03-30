/* @flow */
import React from 'react';
import { isActive } from '../../helpers/router';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module 'react-router-relative-links' o... Remove this comment to see the full error message
import { RelativeLink } from 'react-router-relative-links';

export default class NavLink extends RelativeLink {
  props: {
    to: string,
    path?: string,
  // @ts-expect-error ts-migrate(2729) FIXME: Property 'props' is used before its initialization... Remove this comment to see the full error message
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
