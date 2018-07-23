// @flow
import React from 'react';

import Crumb from './crumb';

type Props = {
  children?: any,
  collapsed?: boolean,
  onClick?: Function,
  noFloat?: boolean,
};

const Breadcrumbs: Function = ({
  children,
  collapsed: collapsed = true,
  onClick,
  noFloat,
}: Props): React.Element<any> => (
  <ul className={`bp3-breadcrumbs ${noFloat ? '' : 'pull-left'}`}>
    {collapsed && (
      <li onClick={onClick}>
        <span className="bp3-breadcrumbs-collapsed" />
      </li>
    )}
    {children}
  </ul>
);

export { Breadcrumbs, Crumb };
