import React, { Component, PropTypes } from 'react';

import { Link } from 'react-router';

import AlertsTable from './alerts/table';
import NavLink from '../../components/navlink';

export default class Dashboard extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    route: PropTypes.object,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
    getTitle: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div>
        <div className="container-fluid">
          <div className="col-md-4"><h4>System health</h4></div>
          <div className="col-md-8"><h4>Performance charts</h4></div>
        </div>
        <div className="container-fluid">
          <ul className="nav nav-pills">
            <NavLink to="/system/dashboard/ongoing">Ongoing</NavLink>
            <NavLink to="/system/dashboard/transient">Transient</NavLink>
          </ul>
          <div className="col-md-12">
            { this.props.children }
          </div>
        </div>
      </div>
    );
  }
}
