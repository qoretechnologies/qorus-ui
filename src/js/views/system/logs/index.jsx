import React, { Component, PropTypes } from 'react';

import Nav, { NavLink } from '../../../components/navlink';

import LogsLog from './log';

export default class Logs extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    route: PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    getTitle: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="tab-pane active">
          <Nav
            path={this.context.location.pathname}
            type="nav-pills"
          >
            <NavLink to="./main">Main</NavLink>
            <NavLink to="./http">Http</NavLink>
            <NavLink to="./audit">Audit</NavLink>
            <NavLink to="./alert">Alert</NavLink>
            <NavLink to="./monitor">Monitor</NavLink>
          </Nav>
          { this.props.children }
      </div>
    );
  }
}

Logs.Log = LogsLog;
