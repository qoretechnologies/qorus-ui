// @flow
import React from 'react';

import Crumb from './crumb';
import CrumbTabs from './tabs';
import CollapsedCrumb from './collapsedCrumb';
import { Icon } from '@blueprintjs/core';

type Props = {
  children?: any,
  collapsed?: boolean,
  onClick?: Function,
  noFloat?: boolean,
  icon: string,
};

const Breadcrumbs: Function = ({
  children,
  onClick,
  noFloat,
  icon: icon = 'home',
}: Props): React.Element<any> => (
  <ul className={`pt-breadcrumbs ${noFloat ? '' : 'pull-left'}`}>
    <li>
      <Icon className="pt-breadcrumb" iconName={icon} />
    </li>
    {children}
  </ul>
);

export { Breadcrumbs, Crumb, CrumbTabs, CollapsedCrumb };
