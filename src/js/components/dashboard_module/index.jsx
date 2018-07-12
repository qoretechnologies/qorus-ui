// @flow
import React from 'react';

import Icon from '../../components/icon';

type Props = {
  children: any,
  title: string,
  titleStyle: string,
  icon?: string,
};

const DashboardModule: Function = ({
  children,
  title,
  titleStyle,
  icon,
}: Props): React.Element<any> => (
  <div className="dashboard-module">
    <div className="content">{children}</div>
  </div>
);

export default DashboardModule;
