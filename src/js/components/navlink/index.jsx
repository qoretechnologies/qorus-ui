/* @flow */
import React from 'react';
import NavLink from './link';

type Props = {
  path: string,
  children: any,
  type: string,
  className: string,
};

const renderChildren: Function = (
  children: any,
  path: string
): React.Element<any> =>
  React.Children.map(children, c => <c.type {...c.props} path={path} />);

const Nav: Function = ({ children, path }: Props): React.Element<any> => (
  <div className="pt-tabs">
    <ul className="pt-tab-list" role="tablist">
      {renderChildren(children, path)}
    </ul>
  </div>
);

export default Nav;
export { NavLink };
