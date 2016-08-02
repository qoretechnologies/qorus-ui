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
    const props = omit(this.props, 'path');

    return (
      <li
        role="presentation"
        className={ isActive(this.state.to, this.props.path) ? 'active' : '' }
      >
        <RelativeLink {...props} activeClassName="active" />
      </li>
    );
  }
}

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  path: PropTypes.string,
};
