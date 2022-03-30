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
  collapsed = false,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <ul className={`bp3-breadcrumbs ${noFloat ? '' : 'pull-left'}`}>
    {!collapsed && (
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
      <li onClick={onClick}>
        {icon ? (
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'IconName ... Remove this comment to see the full error message
          <Icon className="bp3-breadcrumb" icon={icon} />
        ) : (
          <img src={qoreLogo} style={{ width: '15px' }} />
        )}
      </li>
    )}
    {children}
  </ul>
);

export { Breadcrumbs, Crumb, CrumbTabs, CollapsedCrumb };
