/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import websocket from '../hocomponents/websocket';
import * as actions from '../store/log/actions';
import Log from '../components/log';
import Tabs, { Pane } from '../components/tabs';
import { DEFAULTSTATE, LABELS } from '../constants/log';
import Logger from './Logger';

const dataSelector: Function = (state: Object, props: Object): Object =>
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'log' does not exist on type 'Object'.
  state.log.data[props.url] || DEFAULTSTATE;

// @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
const containerSelector: Function = createSelector(
  [dataSelector],
  ({ messages }) => ({
    messages,
  })
);

const LogArea = compose(
  mapProps(
    (props: Object): Object => ({
      ...props,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'resource' does not exist on type 'Object... Remove this comment to see the full error message
      url: `log/${props.resource}`,
    })
  ),
  connect(
    containerSelector,
    {
      update: actions.onMessage,
      init: actions.init,
      disconnect: actions.onDisconnect,
      clear: actions.clear,
    }
  ),
  websocket({
    onOpen: 'init',
    onMessage: 'update',
    onDisconnect: 'disconnect',
  }),
  withHandlers({
    onClearClick: (props: Object): Function => (): void => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'clear' does not exist on type 'Object'.
      props.clear(props.url);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'update' does not exist on type 'Object'.
      props.update(props.url, LABELS.cleared);
    },
  })
)(Log);

const LogContainer = props => (
  // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
  <Tabs active="log">
    // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message
    <Pane name="Log">
      <LogArea {...props} />
    </Pane>
    {props.intfc && (
      // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message
      <Pane name="Settings">
        <Logger
          id={props.id}
          resource={props.intfc}
          url={props.url}
          isSystem={props.isSystem}
        />
      </Pane>
    )}
  </Tabs>
);

export default LogContainer;
