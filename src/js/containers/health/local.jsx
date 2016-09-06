/* @flow */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import shouldUpdate from 'recompose/shouldUpdate';

import sync from '../../hocomponents/sync';
import actions from '../../store/api/actions';
import { Control } from '../../components/controls';
import Dialog from '../../components/dialog';
import LocalInfo from './local_info';
import { statusHealth } from '../../helpers/system';

const LocalHealth = ({ health }: { health: Object }) => (
  <Dialog
    className="nav-btn-tooltip"
    mainElement={
      <Control
        big
        className={`btn navbar-btn btn-${statusHealth(health.data.health)} local-health-dropdown`}
        btnStyle={statusHealth(health.data.health)}
        icon="stethoscope"
      />
    }
  >
    <LocalInfo {...{ health }} />
  </Dialog>
);

export default compose(
  connect(
    state => ({ health: state.api.health }),
    {
      load: actions.health.fetch,
    }
  ),
  shouldUpdate(
    (props: Object, nextProps: Object): boolean => {
      const { sync: syncData, loading } = props.health;
      const { sync: nextSync, loading: nextLoading } = nextProps.health;
      return syncData !== nextSync || loading !== nextLoading;
    }
  ),
  sync('health', false)
)(LocalHealth);
