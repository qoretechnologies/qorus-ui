/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import { connect } from 'react-redux';
import { Route, Router, IndexRedirect } from 'react-router';
import Loadable from 'react-loadable';

import Root from './views/root';
import sync from './hocomponents/sync';
import websocket from './hocomponents/websocket';
import actions from './store/api/actions';
import * as events from './store/apievents/actions';
import Loader from './components/loader';
import System from './views/system';

const Login = Loadable({
  loader: () => import(/* webpackChunkName: "login" */ './views/auth'),
  loading: Loader,
});

const Ocmd = Loadable({
  loader: () => import(/* webpackChunkName: "ocmd" */ './views/ocmd'),
  loading: Loader,
});

const Groups = Loadable({
  loader: () => import(/* webpackChunkName: "groups" */ './views/groups'),
  loading: Loader,
});

const Jobs = Loadable({
  loader: () => import(/* webpackChunkName: "jobs" */ './views/jobs'),
  loading: Loader,
});

const Mapper = Loadable({
  loader: () => import(/* webpackChunkName: "mapper" */ './views/mapper'),
  loading: Loader,
});

const Library = Loadable({
  loader: () => import(/* webpackChunkName: "library" */ './views/library'),
  loading: Loader,
});

const User = Loadable({
  loader: () => import(/* webpackChunkName: "user" */ './views/user'),
  loading: Loader,
});

const Extensions = Loadable({
  loader: () =>
    import(/* webpackChunkName: "extensions" */ './views/extensions'),
  loading: Loader,
});

const ExtensionDetail = Loadable({
  loader: () =>
    import(/* webpackChunkName: "extension-detail" */ './views/extensions/detail'),
  loading: Loader,
});

const Job = Loadable({
  loader: () => import(/* webpackChunkName: "job" */ './views/jobs/detail'),
  loading: Loader,
});

const ErrorView = Loadable({
  loader: () => import(/* webpackChunkName: "error" */ './error'),
  loading: Loader,
});

const OAuthView = Loadable({
  loader: () => import(/* webpackChunkName: "oauth2" */ './views/oauth'),
  loading: Loader,
});

const Order = Loadable({
  loader: () => import(/* webpackChunkName: "order" */ './views/order'),
  loading: Loader,
});

const Service = Loadable({
  loader: () =>
    import(/* webpackChunkName: "service" */ './views/services/detail'),
  loading: Loader,
});

const Search = Loadable({
  loader: () => import(/* webpackChunkName: "search" */ './views/search'),
  loading: Loader,
});

const Workflow = Loadable({
  loader: () =>
    import(/* webpackChunkName: "workflow" */ './views/workflows/detail'),
  loading: Loader,
});

const Services = Loadable({
  loader: () => import(/* webpackChunkName: "services" */ './views/services'),
  loading: Loader,
});

const Workflows = Loadable({
  loader: () => import(/* webpackChunkName: "workflows" */ './views/workflows'),
  loading: Loader,
});

const Sla = Loadable({
  loader: () =>
    import(/* webpackChunkName: "sla" */ './views/system/slas/detail'),
  loading: Loader,
});

class AppInfo extends React.Component {
  props: {
    info: Object,
    logout: Function,
    routerProps: Object,
  } = this.props;
  /**
   * requireAnonymous - redirect to main page if user authenticated
   * @param  {*} nextState next router state
   * @param  {Function} replace change state function
   */
  requireAnonymous = (nextState, replace) => {
    const {
      info: {
        data: { noauth },
      },
    } = this.props;
    const token = window.localStorage.getItem('token');
    if (token || noauth) {
      replace('/');
    }
  };

  /**
   * requireAuthenticated - redirect to login page is user isn't authenticated
   * add current path as get param "next"
   * @param  {*} nextState next router state
   * @param  {Function} replace change state function
   */
  requireAuthenticated = (nextState, replace) => {
    const { noauth } = this.props.info.data;
    const token = window.localStorage.getItem('token');

    if (!token && !noauth) {
      replace(
        `/login?next=${nextState.location.pathname}${encodeURIComponent(
          nextState.location.search
        )}`
      );
    }
  };

  logout = (nextState, replace) => {
    const { logout } = this.props;

    logout(replace);
  };

  render () {
    if (this.props.info.error) {
      return (
        <Router {...this.props.routerProps}>
          <Route path="/error" component={ErrorView} />
        </Router>
      );
    }

    if (this.props.info.sync) {
      return (
        <Router {...this.props.routerProps}>
          <Route path="/" component={Root} onEnter={this.requireAuthenticated}>
            <IndexRedirect to="/system/dashboard" />
            <Route path="/system" component={System}>
              <IndexRedirect to="dashboard" />
              <Route path="dashboard" component={System.Dashboard} />
              <Route path="alerts" component={System.Alerts} />
              <Route path="options" component={System.Options} />
              <Route path="remote" component={System.Connections} />
              <Route path="props" component={System.Properties} />
              <Route path="slas" component={System.Slas} />
              <Route path="sla/:id" component={Sla} />
              <Route path="values" component={System.Valuemaps} />
              <Route path="sqlcache" component={System.SqlCache} />
              <Route path="http" component={System.HttpServices} />
              <Route path="info" component={System.Info} />
              <Route path="logs" component={System.Logs} />
              <Route path="rbac" component={System.RBAC} />
              <Route path="errors" component={System.Errors} />
              <Route path="releases" component={System.Releases} />
              <Route path="cluster" component={System.Cluster} />
              <Route path="orderStats" component={System.OrderStats} />
            </Route>
            <Route path="workflow/:id" component={Workflow} />
            <Route path="order/:id/:date" component={Order} />
            <Route path="services" component={Services} />
            <Route path="service/:id" component={Service} />
            <Route path="job/:id" component={Job} />
            <Route path="ocmd" component={Ocmd} />
            <Route path="user" component={User} />
            <Route path="mappers/:id" component={Mapper} />
            <Route path="library" component={Library} />
            <Route path="extensions" component={Extensions} />
            <Route path="extension/:name" component={ExtensionDetail} />
            <Route path="oauth2" component={OAuthView} />
            <Route path="groups" component={Groups} />
            <Route path="jobs" component={Jobs} />
            <Route path="search" component={Search} />
            <Route path="workflows" component={Workflows} />
          </Route>
          <Route
            path="/login"
            component={Login}
            onEnter={this.requireAnonymous}
          />
          <Route path="/logout" onEnter={this.logout} />
          <Route path="/error" component={ErrorView} />
        </Router>
      );
    }

    return null;
  }
}

export default compose(
  connect(
    state => ({
      info: state.api.info,
    }),
    {
      load: actions.info.fetch,
      logout: actions.logout.logout,
      message: events.message,
      close: events.disconnect,
    }
  ),
  defaultProps({
    url: 'apievents',
  }),
  sync('info', false),
  websocket(
    {
      onMessage: 'message',
      onClose: 'close',
    },
    false,
    false,
    false
  )
)(AppInfo);
