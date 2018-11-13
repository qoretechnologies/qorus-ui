// @flow
import React from 'react';

import Crumb from './crumb';
import CrumbTabs from './tabs';
import CollapsedCrumb from './collapsedCrumb';
import { Icon } from '@blueprintjs/core';
import qoreLogo from '../../../img/qore_logo.png';

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
}: Props): React.Element<any> => (
  <ul className={`pt-breadcrumbs ${noFloat ? '' : 'pull-left'}`}>
    {icon ? (
      <li onClick={onClick}>
        <Icon className="pt-breadcrumb" iconName={icon} />
      </li>
    ) : (
      <li onClick={onClick}>
        <img src={qoreLogo} style={{ width: '15px' }} />
      </li>
    )}
    {children}
  </ul>
);

export { Breadcrumbs, Crumb, CrumbTabs, CollapsedCrumb };
