/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import { connect } from 'react-redux';
import { Route, Router, IndexRedirect } from 'react-router';

import Root from './views/root';
import Login from './views/auth';
import Ocmd from './views/ocmd';
import Mapper from './views/mapper';
import Library from './views/library';
import User from './views/user';
import Extensions from './views/extensions';
import ExtensionDetail from './views/extensions/detail';
import sync from './hocomponents/sync';
import websocket from './hocomponents/websocket';
import actions from './store/api/actions';
import dashboardRoutes from './routes/dashboard';
import workflowsRoutes from './routes/workflows';
import jobsRoutes from './routes/jobs';
import Job from './views/jobs/detail';
import searchRoutes from './routes/search';
import groupsRoutes from './routes/groups';
import ErrorView from './error';
import * as events from './store/apievents/actions';

import Workflow from './views/workflows/detail';
import Order from './views/order';
import Services from './views/services';
import Service from './views/services/detail';

class AppInfo extends React.Component {
  props: {
    info: Object,
    logout: Function,
    routerProps: Object,
  };
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

  render() {
    if (this.props.info.error) {
      return (
        <Router {...this.props.routerProps} key={Math.random()}>
          <Route path="/error" component={ErrorView} />
        </Router>
      );
    }

    if (this.props.info.sync) {
      return (
        <Router {...this.props.routerProps} key={Math.random()}>
          <Route path="/" component={Root} onEnter={this.requireAuthenticated}>
            <IndexRedirect to="/system/dashboard" />
            {dashboardRoutes()}
            {workflowsRoutes()}
            <Route path="workflow/:id" component={Workflow} />
            <Route path="order/:id/:date" component={Order} />
            <Route path="services" component={Services} />
            <Route path="service/:id" component={Service} />
            {jobsRoutes()}
            <Route path="job/:id" component={Job} />
            {searchRoutes()}
            {groupsRoutes()}
            <Route path="ocmd" component={Ocmd} />
            <Route path="user" component={User} />
            <Route path="mappers/:id" component={Mapper} />
            <Route path="library" component={Library} />
            <Route path="extensions" component={Extensions} />
            <Route path="extension/:name" component={ExtensionDetail} />
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
