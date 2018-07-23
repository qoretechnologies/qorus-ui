/* @flow */
import React, { PropTypes } from 'react';
import { isActive } from '../../helpers/router';
import { omit } from 'lodash';

import { RelativeLink } from 'react-router-relative-links';

export default class NavLink extends RelativeLink {
  props: {
    to: string,
    path?: string,
  };

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

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  path: PropTypes.string,
};
