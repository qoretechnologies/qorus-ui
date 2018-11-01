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
};

const Breadcrumbs: Function = ({
  children,
  onClick,
  noFloat,
}: Props): React.Element<any> => (
  <ul className={`pt-breadcrumbs ${noFloat ? '' : 'pull-left'}`}>
    <li>
      <Icon className="pt-breadcrumb" iconName="home" />
    </li>
    {children}
  </ul>
);

export { Breadcrumbs, Crumb, CrumbTabs, CollapsedCrumb };
