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
  state.log.data[props.url] || DEFAULTSTATE;

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
      props.clear(props.url);
      props.update(props.url, LABELS.cleared);
    },
  })
)(Log);

const LogContainer = props => (
  <Tabs active="log">
    <Pane name="Log">
      <LogArea {...props} />
    </Pane>
    {props.intfc && (
      <Pane name="Settings">
        <Logger
          id={props.id}
          resource={props.intfc}
          isSystem={props.isSystem}
        />
      </Pane>
    )}
  </Tabs>
);

export default LogContainer;
