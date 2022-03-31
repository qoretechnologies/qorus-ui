import React from 'react';
import Flex from '../../components/Flex';
import Releases from '../../containers/releases';
import Alerts from './alerts';
import Cluster from './cluster';
import ConfigItems from './config_items';
import Connections from './connections';
import Dashboard from './dashboard';
import Errors from './errors';
import UserHttp from './http';
import SystemInfoTable from './info';
import Logs from './logs';
import Options from './options';
import OrderStats from './order_stats';
import Properties from './properties';
import Providers from './providers';
import Rbac from './rbac';
import Slas from './slas';
import SqlCache from './sqlcache';
import Valuemaps from './valuemaps';

type Props = {
  location: any;
  children: any;
};

const System: Function = ({
  location,
  children,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Flex>
    {/* @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message */}
    {React.Children.map(children, (child) => React.cloneElement(child, { location }))}
  </Flex>
);

// @ts-ignore ts-migrate(2339) FIXME: Property 'Dashboard' does not exist on type 'Funct... Remove this comment to see the full error message
System.Dashboard = Dashboard;
// @ts-ignore ts-migrate(2339) FIXME: Property 'Alerts' does not exist on type 'Function... Remove this comment to see the full error message
System.Alerts = Alerts;
// @ts-ignore ts-migrate(2339) FIXME: Property 'Options' does not exist on type 'Functio... Remove this comment to see the full error message
System.Options = Options;
// @ts-ignore ts-migrate(2339) FIXME: Property 'Connections' does not exist on type 'Fun... Remove this comment to see the full error message
System.Connections = Connections;
// @ts-ignore ts-migrate(2339) FIXME: Property 'Properties' does not exist on type 'Func... Remove this comment to see the full error message
System.Properties = Properties;
// @ts-ignore ts-migrate(2339) FIXME: Property 'SqlCache' does not exist on type 'Functi... Remove this comment to see the full error message
System.SqlCache = SqlCache;
// @ts-ignore ts-migrate(2339) FIXME: Property 'HttpServices' does not exist on type 'Fu... Remove this comment to see the full error message
System.HttpServices = UserHttp;
// @ts-ignore ts-migrate(2339) FIXME: Property 'RBAC' does not exist on type 'Function'.
System.RBAC = Rbac;
// @ts-ignore ts-migrate(2339) FIXME: Property 'Info' does not exist on type 'Function'.
System.Info = SystemInfoTable;
// @ts-ignore ts-migrate(2339) FIXME: Property 'Logs' does not exist on type 'Function'.
System.Logs = Logs;
// @ts-ignore ts-migrate(2339) FIXME: Property 'Errors' does not exist on type 'Function... Remove this comment to see the full error message
System.Errors = Errors;
// @ts-ignore ts-migrate(2339) FIXME: Property 'Valuemaps' does not exist on type 'Funct... Remove this comment to see the full error message
System.Valuemaps = Valuemaps;
// @ts-ignore ts-migrate(2339) FIXME: Property 'Releases' does not exist on type 'Functi... Remove this comment to see the full error message
System.Releases = Releases;
// @ts-ignore ts-migrate(2339) FIXME: Property 'Slas' does not exist on type 'Function'.
System.Slas = Slas;
// @ts-ignore ts-migrate(2339) FIXME: Property 'Cluster' does not exist on type 'Functio... Remove this comment to see the full error message
System.Cluster = Cluster;
// @ts-ignore ts-migrate(2339) FIXME: Property 'OrderStats' does not exist on type 'Func... Remove this comment to see the full error message
System.OrderStats = OrderStats;
// @ts-ignore ts-migrate(2339) FIXME: Property 'ConfigItems' does not exist on type 'Fun... Remove this comment to see the full error message
System.ConfigItems = ConfigItems;
// @ts-ignore ts-migrate(2339) FIXME: Property 'Providers' does not exist on type 'Funct... Remove this comment to see the full error message
System.Providers = Providers;

export default System;
