// @flow
import React from 'react';

type Props = {
  children: any;
  title: string;
  titleStyle: string;
  icon?: string;
};

// @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const DashboardModule: Function = ({ children }: Props): React.Element<any> => (
  <div className="dashboard-module">
    <div className="content">{children}</div>
  </div>
);

export default DashboardModule;
