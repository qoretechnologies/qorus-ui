// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { ButtonGroup, Button, Intent } from '@blueprintjs/core';

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
};

const ServiceControls: Function = ({
  handleEnableClick,
  handleLoadClick,
  handleResetClick,
  handleAutostartClick,
  loaded,
  enabled,
  autostart,
}: Props): React.Element<any> => (
  <ButtonGroup>
    <Button
      title={enabled ? 'Disable' : 'Enable'}
      iconName="power"
      intent={enabled ? Intent.SUCCESS : Intent.DANGER}
      onClick={handleEnableClick}
      className="pt-small"
    />
    <Button
      title={autostart ? 'Disable autostart' : 'Enable autostart'}
      iconName={autostart ? 'pause' : 'play'}
      intent={autostart ? Intent.PRIMARY : Intent.NONE}
      onClick={handleAutostartClick}
      className="pt-small"
    />
    <Button
      title={loaded ? 'Unload' : 'Load'}
      iconName={loaded ? 'small-tick' : 'remove'}
      onClick={handleLoadClick}
      className="pt-small"
    />
    <Button
      title="Reset"
      iconName="refresh"
      onClick={handleResetClick}
      className="pt-small"
    />
  </ButtonGroup>
);

export default compose(
  connect(
    null,
    {
      action: actions.services.serviceAction,
    }
  ),
  mapProps(
    ({ status, ...rest }: Props): Object => ({
      loaded: status !== 'unloaded',
      ...rest,
    })
  ),
  withHandlers({
    handleEnableClick: ({
      enabled,
      action,
      id,
    }: Props): Function => (): void => {
      action(enabled ? 'disable' : 'enable', id);
    },
    handleAutostartClick: ({
      autostart,
      action,
      id,
    }: Props): Function => (): void => {
      action('autostart', id, autostart);
    },
    handleLoadClick: ({ loaded, action, id }: Props): Function => (): void => {
      action(loaded ? 'unload' : 'load', id);
    },
    handleResetClick: ({ action, id }: Props): Function => (): void => {
      action('reset', id);
    },
  }),
  pure(['enabled', 'loaded', 'autostart'])
)(ServiceControls);
