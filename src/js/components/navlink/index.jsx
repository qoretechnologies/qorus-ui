/* @flow */
import React, { PropTypes } from 'react';
import NavLink from './link';

type Props = {
  path: string,
  children: any,
  type: string,
  className: string,
};

const renderChildren: Function = (children: any, path: string): React.Element<any> => (
  React.Children.map(children, (c) => (
    <c.type
      {...c.props}
      path={path}
    />
  ))
);

const Nav: Function = ({
  children,
  type: tp = 'nav-tabs',
  path,
  className: cls = '',
}: Props): React.Element<any> => (
  <ul className={`nav ${tp} ${cls || ''}`}>
    { renderChildren(children, path) }
  </ul>
);

Nav.propTypes = {
  path: PropTypes.string,
  children: PropTypes.node,
  type: PropTypes.string,
};

export default Nav;
export {
  NavLink,
};
