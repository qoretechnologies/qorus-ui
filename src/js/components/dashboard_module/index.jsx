// @flow
import React from 'react';

type Props = {
  children: any,
  title: string,
  titleStyle: string,
  icon?: string,
};

const DashboardModule: Function = ({ children }: Props): React.Element<any> => (
  <div className="dashboard-module">
    <div className="content">{children}</div>
  </div>
);

export default DashboardModule;
