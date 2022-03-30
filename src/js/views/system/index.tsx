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
import ConfigItems from './config_items';
import Providers from './providers';

type Props = {
  location: Object,
  children: any,
};

const System: Function = ({
  location,
  children,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <Flex>
    // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
    {React.Children.map(children, (child: React.Element<any>) =>
      React.cloneElement(child, { location })
    )}
  </Flex>
);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'Dashboard' does not exist on type 'Funct... Remove this comment to see the full error message
System.Dashboard = Dashboard;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'Alerts' does not exist on type 'Function... Remove this comment to see the full error message
System.Alerts = Alerts;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'Options' does not exist on type 'Functio... Remove this comment to see the full error message
System.Options = Options;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'Connections' does not exist on type 'Fun... Remove this comment to see the full error message
System.Connections = Connections;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'Properties' does not exist on type 'Func... Remove this comment to see the full error message
System.Properties = Properties;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'SqlCache' does not exist on type 'Functi... Remove this comment to see the full error message
System.SqlCache = SqlCache;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'HttpServices' does not exist on type 'Fu... Remove this comment to see the full error message
System.HttpServices = UserHttp;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'RBAC' does not exist on type 'Function'.
System.RBAC = Rbac;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'Info' does not exist on type 'Function'.
System.Info = SystemInfoTable;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'Logs' does not exist on type 'Function'.
System.Logs = Logs;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'Errors' does not exist on type 'Function... Remove this comment to see the full error message
System.Errors = Errors;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'Valuemaps' does not exist on type 'Funct... Remove this comment to see the full error message
System.Valuemaps = Valuemaps;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'Releases' does not exist on type 'Functi... Remove this comment to see the full error message
System.Releases = Releases;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'Slas' does not exist on type 'Function'.
System.Slas = Slas;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'Cluster' does not exist on type 'Functio... Remove this comment to see the full error message
System.Cluster = Cluster;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'OrderStats' does not exist on type 'Func... Remove this comment to see the full error message
System.OrderStats = OrderStats;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'ConfigItems' does not exist on type 'Fun... Remove this comment to see the full error message
System.ConfigItems = ConfigItems;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'Providers' does not exist on type 'Funct... Remove this comment to see the full error message
System.Providers = Providers;

export default System;
