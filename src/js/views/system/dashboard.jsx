import React, { Component, PropTypes } from 'react';

import { Link } from 'react-router';

import AlertsTable from './alerts' ;

function NavLink(props) {
  return (
    <Link {...props} activeClassName="active" />
  );
}

function NotImplemented() {
  return (<div className="tab-pane active"><p>Not implemented yet</p></div>);
}

export default class Dashboard extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    route: PropTypes.object,
    location: PropTypes.object
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
    getTitle: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div>
        <div><h3>System health</h3></div>
        <div><h3>Performance charts</h3></div>
        <div>
          <ul className="nav nav-pills">
            <li
              role="presentation"
              className={ this.context.router.isActive(this.props.location) ? 'active' : '' }
            >
              <NavLink to="/system/dashboard/ongoing">Ongoing</NavLink>
            </li>
            <li
              role="presentation"
              className={ this.context.router.isActive(this.props.location) ? 'active' : '' }
            >
              <NavLink to="/system/dashboard/transient">Transient</NavLink>
            </li>
          </ul>
          { this.props.children }
        </div>
      </div>
    );
  }
}

Dashboard.Ongoing = AlertsTable;
Dashboard.Transient = AlertsTable;
