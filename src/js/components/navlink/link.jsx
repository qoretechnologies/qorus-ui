import React, { PropTypes } from 'react';
import { isActive } from '../../helpers/router';

import { RelativeLink } from 'react-router-relative-links';

export default class NavLink extends RelativeLink {
  static propTypes = {
    to: PropTypes.string.isRequired,
    path: PropTypes.string,
  };

  render() {
    return (
      <li
        role="presentation"
        className={ isActive(this.state.to, this.props.path) ? 'active' : '' }
      >
        <RelativeLink {...this.props} activeClassName="active" />
      </li>
    );
  }
}