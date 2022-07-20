/* @flow */
import React from 'react';
import NavLink from './link';

type Props = {
  path: string;
  children: any;
  type: string;
  className: string;
};

const renderChildren: Function = (
  children: any,
  path: string
  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
) => React.Children.map(children, (c) => <c.type {...c.props} path={path} />);

// @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const Nav: Function = ({ children, path }: Props) => (
  <div className="bp3-tabs">
    <ul className="bp3-tab-list" role="tablist">
      {renderChildren(children, path)}
    </ul>
  </div>
);

export default Nav;
export { NavLink };
