// @flow
import React from 'react';

type Props = { title: string, children: any, left?: boolean };

const DashboardModuleItem: Function = ({
  title,
  children,
  left,
}: Props): React.Element<any> => (
  <div className="dashboard-module-item">
    {title}
    <div className={`${left ? 'pull-left' : 'pull-right'}`}>{children}</div>
  </div>
);

export default DashboardModuleItem;
