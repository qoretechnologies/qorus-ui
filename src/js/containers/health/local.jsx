/* @flow */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import sync from '../../hocomponents/sync';
import actions from '../../store/api/actions';
import Dropdown, { Control as DropdownControl, CustomItem } from '../../components/dropdown';
import LocalInfo from './local_info';
import { statusHealth } from '../../helpers/system';

const LocalHealth = ({ health }: { health: Object }) => (
  <Dropdown>
    <DropdownControl
      className={`btn navbar-btn btn-${statusHealth(health.data.health)} local-health-dropdown`}
      noCaret
    >
      <i className="fa fa-stethoscope" />
    </DropdownControl>
    <CustomItem>
      <LocalInfo {...{ health }} />
    </CustomItem>
  </Dropdown>
);

export default compose(
  connect(
    state => ({ health: state.api.health }),
    {
      load: actions.health.fetch,
    }
  ),
  sync('health', false)
)(LocalHealth);
