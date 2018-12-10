import React from 'react';

import Alerts from './alerts';
import Dashboard from './dashboard';
import Options from './options';
import Connections from './connections';
import Errors from './errors';
import UserHttp from './http';
import Logs from './logs';
import SystemInfoTable from './info';
import SqlCache from './sqlcache';
import Properties from './properties';
import Rbac from './rbac';
import Valuemaps from './valuemaps';
import Releases from '../../containers/releases';
import Slas from './slas';
import Cluster from './cluster';
import OrderStats from './order_stats';
import Flex from '../../components/Flex';

type Props = {
  location: Object,
  children: any,
};

const System: Function = ({
  location,
  children,
}: Props): React.Element<any> => (
  <Flex>
    {React.Children.map(children, (child: React.Element<any>) =>
      React.cloneElement(child, { location })
    )}
  </Flex>
);

System.Dashboard = Dashboard;
System.Alerts = Alerts;
System.Options = Options;
System.Connections = Connections;
System.Properties = Properties;
System.SqlCache = SqlCache;
System.HttpServices = UserHttp;
System.RBAC = Rbac;
System.Info = SystemInfoTable;
System.Logs = Logs;
System.Errors = Errors;
System.Valuemaps = Valuemaps;
System.Releases = Releases;
System.Slas = Slas;
System.Cluster = Cluster;
System.OrderStats = OrderStats;

export default System;
