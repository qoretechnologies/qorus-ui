import React, { PropTypes } from 'react';

import { Link } from 'react-router';


export default function NavLink(props, context) {
  return (
    <li
      role="presentation"
      className={ context.router.isActive(props.to) ? 'active' : '' }
    >
      <Link {...props} activeClassName="active" />
    </li>
  );
}

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
};

NavLink.contextTypes = {
  router: PropTypes.object.isRequired,
};
