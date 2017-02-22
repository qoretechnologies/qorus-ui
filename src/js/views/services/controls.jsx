// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';

import { Controls, Control as Button } from '../../components/controls';
import actions from '../../store/api/actions';

type Props = {
  handleEnableClick: Function,
  handleLoadClick: Function,
  handleResetClick: Function,
  handleAutostartClick: Function,
  enabled: boolean,
  loaded: boolean,
  autostart: boolean,
  status: string,
  action: Function,
  id: number,
}

const ServiceControls: Function = ({
  handleEnableClick,
  handleLoadClick,
  handleResetClick,
  handleAutostartClick,
  loaded,
  enabled,
  autostart,
}: Props): React.Element<any> => (
  <Controls grouped>
    <Button
      title={enabled ? 'Disable' : 'Enable'}
      icon="power-off"
      btnStyle={enabled ? 'success' : 'danger'}
      onClick={handleEnableClick}
    />
    <Button
      title={autostart ? 'Disable autostart' : 'Enable autostart'}
      icon={autostart ? 'pause' : 'play'}
      btnStyle={autostart ? 'success' : 'default'}
      onClick={handleAutostartClick}
    />
    <Button
      title={loaded ? 'Unload' : 'Load'}
      icon={loaded ? 'check' : 'remove'}
      btnStyle={loaded ? 'success' : 'default'}
      onClick={handleLoadClick}
    />
    <Button
      title="Reset"
      icon="refresh"
      btnStyle={loaded ? 'warning' : 'default'}
      disabled={!loaded}
      onClick={handleResetClick}
    />
  </Controls>
);

export default compose(
  connect(
    null,
    {
      action: actions.services.serviceAction,
    }
  ),
  mapProps(({ status, ...rest }: Props): Object => ({
    loaded: status !== 'unloaded',
    ...rest,
  })),
  withHandlers({
    handleEnableClick: ({ enabled, action, id }: Props): Function => (): void => {
      action(enabled ? 'disable' : 'enable', id);
    },
    handleAutostartClick: ({ autostart, action, id }: Props): Function => (): void => {
      action('autostart', id, autostart);
    },
    handleLoadClick: ({ loaded, action, id }: Props): Function => (): void => {
      action(loaded ? 'unload' : 'load', id);
    },
    handleResetClick: ({ action, id }: Props): Function => (): void => {
      action('reset', id);
    },
  }),
  pure([
    'enabled',
    'loaded',
    'autostart',
  ])
)(ServiceControls);
