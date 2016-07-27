/* @flow */
import React, { PropTypes } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import sync from '../../hocomponents/sync';
import actions from '../../store/api/actions';
import Dropdown, { Control as DropdownControl, CustomItem } from '../../components/dropdown';
import RemoteInfo from './remote-info';

const RemoteHealth = ({ health }: { health: Object }) => (
  <Dropdown>
    <DropdownControl className="btn navbar-btn btn-inverse remote-health-dropdown" noCaret>
      <i className="fa fa-sitemap" />
    </DropdownControl>
    <CustomItem>
      <RemoteInfo health={health} />
    </CustomItem>
  </Dropdown>
);
RemoteHealth.propTypes = {
  health: PropTypes.object,
};

export default compose(
  connect(
    state => ({ health: state.api.health }),
    {
      load: actions.health.fetch,
    }
  ),
  sync('health', false)
)(RemoteHealth);
