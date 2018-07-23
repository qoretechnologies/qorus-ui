/* @flow */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import shouldUpdate from 'recompose/shouldUpdate';
import withHandlers from 'recompose/withHandlers';
import { browserHistory } from 'react-router';

import sync from '../../hocomponents/sync';
import actions from '../../store/api/actions';
import { statusHealth } from '../../helpers/system';
import Dropdown, { Control, Item } from '../../components/dropdown';
import Icon from '../../components/icon';
import Label from '../../components/label';

const LocalHealth = ({
  health,
  handleOngoingClick,
  handleTransientClick,
}: {
  health: Object,
  handleOngoingClick: Function,
  handleTransientClick: Function,
}) => (
  <Dropdown>
    <Control
      noCaret
      className={`btn navbar-btn btn-${statusHealth(health.data.health)} local-health-dropdown`}
      btnStyle={statusHealth(health.data.health)}
    >
      <Icon iconName="stethoscope" />
    </Control>
    <Item
      title={
        <span>
          Status -
          {' '}
          <Label style={statusHealth(health.data.health)}>{health.data.health}</Label>
        </span>
      }
    />
    <Item
      title={
        <span>
          Ongoing - {health.data.ongoing}
        </span>
      }
      action={handleOngoingClick}
    />
    <Item
      title={
        <span>
          Transient - {health.data.transient}
        </span>
      }
      action={handleTransientClick}
    />
  </Dropdown>
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
  withHandlers({
    handleOngoingClick: (): Function => (): void => {
      browserHistory.push('/system/alerts/ongoing');
    },
    handleTransientClick: (): Function => (): void => {
      browserHistory.push('/system/alerts/transient');
    },
  }),
  sync('health', false)
)(LocalHealth);
