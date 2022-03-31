// @flow
import React from 'react';

type Props = { title: string; children: any; left?: boolean };

const DashboardModuleItem: Function = ({
  title,
  children,
  left,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props): React.Element<any> => (
  <div className="dashboard-module-item">
    {title}
    <div className={`${left ? 'pull-left' : 'pull-right'}`}>{children}</div>
  </div>
);

export default DashboardModuleItem;
