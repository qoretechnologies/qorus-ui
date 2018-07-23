/* @flow */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import shouldUpdate from 'recompose/shouldUpdate';

import sync from '../../hocomponents/sync';
import actions from '../../store/api/actions';
import Dropdown, { Control, Item } from '../../components/dropdown';
import Icon from '../../components/icon';
import Label from '../../components/label';
import { statusHealth } from '../../helpers/system';

const RemoteHealth = ({
  health,
}: {
  health: Object,
}) => (
  <Dropdown
    disabled={!health.data.remote}
  >
    <Control
      noCaret
      className="btn navbar-btn btn-inverse"
    >
      <Icon iconName="sitemap" />
    </Control>
    {health.data.remote && health.data.remote.map((
      remote: Object,
      index: number
    ): React.Element<any> => (
      <Item
        key={index}
        title={
          <span>
            {remote.name} -
            {' '}
            <Label style={statusHealth(remote.health)}>{remote.health}</Label>
          </span>
        }
      />
    ))}
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
  sync('health', false)
)(RemoteHealth);
