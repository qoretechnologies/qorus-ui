/* @flow */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import sync from '../../hocomponents/sync';
import actions from '../../store/api/actions';
import RemoteInfo from './remote_info';
import { Control } from '../../components/controls';
import Dialog from '../../components/dialog';

const RemoteHealth = ({ health }: { health: Object }) => (
  <Dialog
    className="nav-btn-tooltip"
    mainElement={
      <Control
        big
        className="btn navbar-btn btn-inverse remote-health-dropdown"
        icon="sitemap"
      />
    }
  >
    <RemoteInfo {...{ health }} />
  </Dialog>
);

export default compose(
  connect(
    state => ({ health: state.api.health }),
    {
      load: actions.health.fetch,
    }
  ),
  sync('health', false)
)(RemoteHealth);
