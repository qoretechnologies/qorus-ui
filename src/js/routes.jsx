/* @flow */
import React, { PropTypes } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Route, Router, IndexRedirect } from 'react-router';
import applyMiddleware from 'react-router-apply-middleware';
import { useRelativeLinks } from 'react-router-relative-links';

import Root from './views/root';
import View from './views/view_wrapper';
import Workflows from './views/workflows';
import Workflow from './views/workflow';
import Services from './views/services';
import Jobs from './views/jobs';
import Job, { JobResults, JobLog } from './views/job';
import ResultDetail from './views/job/tabs/results/detail';
import System from './views/system';
import Order from './views/order';
import Search from './views/search';
import Groups from './views/groups';
import Login from './views/auth';
import Ocmd from './views/ocmd';
import Library from './views/library';
import Extensions from './views/extensions';
import ExtensionDetail from './views/extensions/detail';

import sync from './hocomponents/sync';
import actions from './store/api/actions';

class AppInfo extends React.Component {

  /**
   * requireAnonymous - redirect to main page if user authenticated
   * @param  {*} nextState next router state
   * @param  {Function} replace change state function
   */
  requireAnonymous = (nextState, replace) => {
    const { info: { data: { noauth } } } = this.props;
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
      replace(`/login?next=${nextState.location.pathname}`);
    }
  };

  logout = (nextState, replace) => {
    const { logout } = this.props;
    window.localStorage.removeItem('token');
    logout();
    replace('/login');
  };

  render() {
    return (
      <Router
        {...this.props.routerProps}
        render={applyMiddleware(useRelativeLinks())}
      >
        <Route
          path="/"
          component={Root}
          onEnter={this.requireAuthenticated}
        >
          <IndexRedirect to="/system/dashboard" />
          <Route path="/system" component={System}>
            <IndexRedirect to="dashboard" />
            <Route path="dashboard" component={System.Dashboard}>
              <IndexRedirect to="ongoing" />
              <Route path=":type" component={System.Alerts.Table}>
                <Route path=":id" component={System.Alerts.Pane} />
              </Route>
            </Route>
            <Route path="alerts" component={System.Alerts}>
              <IndexRedirect to="ongoing" />
              <Route path=":type" component={System.Alerts.Table}>
                <Route path=":id" component={System.Alerts.Pane} />
              </Route>
            </Route>
            <Route path="options" component={System.Options} />
            <Route path="remote" component={System.Connections}>
              <IndexRedirect to="datasources" />
              <Route path=":type" component={System.Connections.Table}>
                <Route path=":id" component={System.Connections.Pane} />
              </Route>
            </Route>
            <Route path="props" component={System.Properties} />
            <Route path="sqlcache" component={System.SqlCache} />
            <Route path="http" component={System.HttpServices} />
            <Route path="info" component={System.Info} />
            <Route path="logs" component={System.Logs}>
              <IndexRedirect to="system" />
                <Route path=":log" component={System.Logs.Log} />
            </Route>
            <Route path="rbac" component={System.RBAC}>
              <IndexRedirect to="users" />
              <Route path="users" component={System.RBAC.Users} />
              <Route path="roles" component={System.RBAC.Roles} />
              <Route path="permissions" component={System.RBAC.Permissions} />
            </Route>
            <Route path="errors" component={System.Errors} />
          </Route>
          <Route
            path="workflows(/:date)(/:filter)(/:detailId)(/:tabId)"
            component={View}
            view={Workflows}
            name="Workflows"
          />
          <Route
            path="workflow(/:id)(/:tabId)(/:filter)(/:date)"
            component={View}
            view={Workflow}
            name="Workflow"
          />
          <Route
            path="order/:id/:date"
            component={Order}
          >
            <IndexRedirect to="diagram" />
            <Route path="diagram" component={Order.Diagram} />
            <Route path="steps" component={Order.Steps} />
            <Route path="data" component={Order.Data}>
              <IndexRedirect to="static" />
              <Route path="static" component={Order.Data.Static} />
              <Route path="dynamic" component={Order.Data.Dynamic} />
              <Route path="keys" component={Order.Data.Keys} />
            </Route>
            <Route path="errors" component={Order.Errors} />
            <Route path="hierarchy" component={Order.Hierarchy} />
            <Route path="audit" component={Order.Audit} />
            <Route path="info" component={Order.Info} />
            <Route path="notes" component={Order.Notes} />
            <Route path="log" component={Order.Log} />
            <Route path="library" component={Order.Library} />
          </Route>
          <Route
            path="services(/:detailId)(/:tabId)"
            component={View}
            view={Services}
            name="Services"
          />
          <Route
            path="jobs(/:date)(/:detailId)(/:tabId)"
            component={View}
            view={Jobs}
            name="Jobs"
          />
          <Route
            path="job/:id"
            component={Job}
          >
            <IndexRedirect to="results" />
            <Route
              path="results"
              component={JobResults}
            >
              <Route
                path=":instanceId"
                component={ResultDetail}
              />
            </Route>
            <Route
              path="log"
              component={JobLog}
            />
          </Route>
          <Route
            path="search"
            component={View}
            view={Search}
            name="Search"
          />
          <Route
            path="groups(/:id)"
            component={View}
            view={Groups}
            name="Groups"
          />
          <Route path="ocmd" component={Ocmd} />
          <Route path="library" component={Library} />
          <Route path="extensions" component={Extensions} />
          <Route path="extension/:name" component={ExtensionDetail} />
          <Route path="performance" />
        </Route>
        <Route
          path="/login"
          component={Login}
          onEnter={this.requireAnonymous}
        />
        <Route
          path="/logout"
          onEnter={this.logout}
        />
      </Router>
    );
  }
}
AppInfo.propTypes = {
  info: PropTypes.object,
  logout: PropTypes.func,
  routerProps: PropTypes.object,
};

export default compose(
  connect(
    state => ({
      info: state.api.info,
    }),
    {
      load: actions.info.fetch,
      logout: actions.logout.logout,
    }
  ),
  sync('info')
)(AppInfo);
