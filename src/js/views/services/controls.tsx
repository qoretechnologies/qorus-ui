// @flow
import { Intent } from '@blueprintjs/core';
import React from 'react';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { Control as Button, Controls as ButtonGroup } from '../../components/controls';
import withDispatch from '../../hocomponents/withDispatch';
import actions from '../../store/api/actions';

type Props = {
  handleEnableClick: Function;
  handleLoadClick: Function;
  handleResetClick: Function;
  handleAutostartClick: Function;
  handleRemoteClick: Function;
  enabled: boolean;
  loaded: boolean;
  autostart: boolean;
  status: string;
  dispatchAction: Function;
  optimisticDispatch: Function;
  id: number;
  remote: boolean;
  type: string;
  big?: boolean;
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
  big,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <ButtonGroup>
    <Button
      title={intl.formatMessage({ id: enabled ? 'button.disable' : 'button.enable' })}
      icon="power"
      intent={enabled ? Intent.SUCCESS : Intent.DANGER}
      onClick={handleEnableClick}
      big={big}
    />
    <Button
      title={intl.formatMessage({
        id: autostart ? 'button.disable-autostart' : 'button.enable-autostart',
      })}
      icon={autostart ? 'pause' : 'play'}
      intent={autostart ? Intent.PRIMARY : Intent.NONE}
      onClick={handleAutostartClick}
      big={big}
    />
    <Button
      title={intl.formatMessage({ id: loaded ? 'button.loaded-click' : 'button.unloaded-click' })}
      icon={loaded ? 'download' : 'upload'}
      intent={loaded ? Intent.PRIMARY : Intent.NONE}
      onClick={handleLoadClick}
      big={big}
    />
    <Button
      title={intl.formatMessage({ id: 'button.reset' })}
      icon="refresh"
      onClick={handleResetClick}
    />
    <Button
      title={intl.formatMessage({ id: remote ? 'button.set-not-remote' : 'button.set-remote' })}
      icon="globe"
      intent={remote ? Intent.PRIMARY : Intent.NONE}
      onClick={handleRemoteClick}
      disabled={type === 'system'}
      big={big}
    />
  </ButtonGroup>
);

export default compose(
  withDispatch(),
  mapProps(({ status, ...rest }: Props): any => ({
    loaded: status !== 'unloaded',
    ...rest,
  })),
  withHandlers({
    handleEnableClick:
      ({ enabled, dispatchAction, id }: Props): Function =>
      (): void => {
        dispatchAction(
          // @ts-ignore ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
          actions.services.serviceAction,
          enabled ? 'disable' : 'enable',
          id,
          null
        );
      },
    handleAutostartClick:
      ({ autostart, dispatchAction, id }: Props): Function =>
      (): void => {
        dispatchAction(
          // @ts-ignore ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
          actions.services.serviceAction,
          'autostart',
          id,
          autostart
        );
      },
    handleLoadClick:
      ({ loaded, dispatchAction, id }: Props): Function =>
      (): void => {
        dispatchAction(
          // @ts-ignore ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
          actions.services.serviceAction,
          loaded ? 'unload' : 'load',
          id,
          null
        );
      },
    handleRemoteClick:
      ({ optimisticDispatch, id, remote }: Props): Function =>
      (): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
        optimisticDispatch(actions.services.setRemote, id, !remote);
      },
    handleResetClick:
      ({ dispatchAction, id }: Props): Function =>
      (): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
        dispatchAction(actions.services.serviceAction, 'reset', id, null);
      },
  }),
  pure(['enabled', 'loaded', 'autostart', 'remote']),
  injectIntl
)(ServiceControls);
