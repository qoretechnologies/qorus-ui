// @flow
import { Icon } from '@blueprintjs/core';
import qoreLogo from '../../../img/qore_logo_purple.png';
import CollapsedCrumb from './collapsedCrumb';
import Crumb from './crumb';
import CrumbTabs from './tabs';

type Props = {
  children?: any;
  collapsed?: boolean;
  onClick?: Function;
  noFloat?: boolean;
  icon?: string;
};

const Breadcrumbs: Function = ({
  children,
  onClick,
  noFloat,
  icon,
  collapsed = false,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <ul className={`bp3-breadcrumbs ${noFloat ? '' : 'pull-left'}`}>
    {!collapsed && children ? (
      // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
      <li onClick={onClick}>
        {icon ? (
          // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'IconName ... Remove this comment to see the full error message
          <Icon className="bp3-breadcrumb" icon={icon} />
        ) : (
          <img src={qoreLogo} style={{ width: '15px' }} />
        )}
      </li>
    ) : null}
    {children}
  </ul>
);

export { Breadcrumbs, Crumb, CrumbTabs, CollapsedCrumb };
