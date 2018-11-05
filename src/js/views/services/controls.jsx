// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';
import { Intent } from '@blueprintjs/core';

import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../components/controls';
import actions from '../../store/api/actions';
import withDispatch from '../../hocomponents/withDispatch';

type Props = {
  handleEnableClick: Function,
  handleLoadClick: Function,
  handleResetClick: Function,
  handleAutostartClick: Function,
  handleRemoteClick: Function,
  enabled: boolean,
  loaded: boolean,
  autostart: boolean,
  status: string,
  dispatchAction: Function,
  optimisticDispatch: Function,
  id: number,
  remote: boolean,
  type: string,
};

const ServiceControls: Function = ({
  handleEnableClick,
  handleLoadClick,
  handleResetClick,
  handleAutostartClick,
  handleRemoteClick,
  loaded,
  enabled,
  autostart,
  type,
  remote,
}: Props): React.Element<any> => (
  <ButtonGroup>
    <Button
      title={enabled ? 'Disable' : 'Enable'}
      iconName="power"
      intent={enabled ? Intent.SUCCESS : Intent.DANGER}
      onClick={handleEnableClick}
    />
    <Button
      title={autostart ? 'Disable autostart' : 'Enable autostart'}
      iconName={autostart ? 'pause' : 'play'}
      intent={autostart ? Intent.PRIMARY : Intent.NONE}
      onClick={handleAutostartClick}
    />
    <Button
      title={loaded ? 'Unload' : 'Load'}
      iconName={loaded ? 'small-tick' : 'cross'}
      intent={loaded ? Intent.PRIMARY : Intent.NONE}
      onClick={handleLoadClick}
    />
    <Button title="Reset" iconName="refresh" onClick={handleResetClick} />
    <Button
      title="Remote"
      iconName="globe"
      intent={remote ? Intent.PRIMARY : Intent.NONE}
      onClick={handleRemoteClick}
      disabled={type === 'system'}
    />
  </ButtonGroup>
);

export default compose(
  withDispatch(),
  mapProps(
    ({ status, ...rest }: Props): Object => ({
      loaded: status !== 'unloaded',
      ...rest,
    })
  ),
  withHandlers({
    handleEnableClick: ({
      enabled,
      dispatchAction,
      id,
    }: Props): Function => (): void => {
      dispatchAction(
        actions.services.serviceAction,
        enabled ? 'disable' : 'enable',
        id,
        null
      );
    },
    handleAutostartClick: ({
      autostart,
      dispatchAction,
      id,
    }: Props): Function => (): void => {
      dispatchAction(
        actions.services.serviceAction,
        'autostart',
        id,
        autostart
      );
    },
    handleLoadClick: ({
      loaded,
      dispatchAction,
      id,
    }: Props): Function => (): void => {
      dispatchAction(
        actions.services.serviceAction,
        loaded ? 'unload' : 'load',
        id,
        null
      );
    },
    handleRemoteClick: ({
      optimisticDispatch,
      id,
      remote,
    }: Props): Function => (): void => {
      optimisticDispatch(actions.services.setRemote, id, !remote);
    },
    handleResetClick: ({ dispatchAction, id }: Props): Function => (): void => {
      dispatchAction(actions.services.serviceAction, 'reset', id, null);
    },
  }),
  pure(['enabled', 'loaded', 'autostart'])
)(ServiceControls);
