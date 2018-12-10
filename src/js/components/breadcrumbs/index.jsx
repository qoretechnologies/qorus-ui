// @flow
import React from 'react';

import Crumb from './crumb';
import CrumbTabs from './tabs';
import CollapsedCrumb from './collapsedCrumb';
import { Icon } from '@blueprintjs/core';
import qoreLogo from '../../../img/qore_logo_purple.png';

type Props = {
  children?: any,
  collapsed?: boolean,
  onClick?: Function,
  noFloat?: boolean,
  icon?: string,
};

const Breadcrumbs: Function = ({
  children,
  onClick,
  noFloat,
  icon,
  collapsed: collapsed = false,
}: Props): React.Element<any> => (
  <ul className={`pt-breadcrumbs ${noFloat ? '' : 'pull-left'}`}>
    {!collapsed && (
      <li onClick={onClick}>
        {icon ? (
          <Icon className="pt-breadcrumb" iconName={icon} />
        ) : (
          <img src={qoreLogo} style={{ width: '15px' }} />
        )}
      </li>
    )}
    {children}
  </ul>
);

export { Breadcrumbs, Crumb, CrumbTabs, CollapsedCrumb };
