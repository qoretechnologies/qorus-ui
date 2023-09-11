// @flow
import { ReqoreControlGroup, ReqoreIcon } from '@qoretechnologies/reqore';
import { IReqoreIconName } from '@qoretechnologies/reqore/dist/types/icons';
import qoreLogo from '../../../img/qore_logo_purple.png';
import CollapsedCrumb from './collapsedCrumb';
import Crumb from './crumb';
import CrumbTabs from './tabs';

type Props = {
  children?: any;
  collapsed?: boolean;
  onClick?: any;
  noFloat?: boolean;
  icon?: IReqoreIconName;
  noIcon?: boolean;
};

const Breadcrumbs: Function = ({
  children,
  onClick,
  noFloat,
  icon,
  collapsed = false,
  noIcon,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <ReqoreControlGroup gapSize="small" fluid>
    {!collapsed && children ? (
      <>
        {icon ? (
          <ReqoreIcon icon={icon || 'SideBarLine'} onClick={onClick} />
        ) : noIcon ? null : (
          <ReqoreIcon image={qoreLogo} />
        )}
      </>
    ) : null}

    {children}
  </ReqoreControlGroup>
);

export { Breadcrumbs, CollapsedCrumb, Crumb, CrumbTabs };
