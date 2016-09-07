/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';
import lifecycle from 'recompose/lifecycle';
import withState from 'recompose/withState';
import includes from 'lodash/includes';
import flowRight from 'lodash/flowRight';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import websocket from '../hocomponents/websocket';
import search from '../hocomponents/search';
import * as actions from '../store/log/actions';
import { querySelector } from '../selectors';
import Log from '../components/log';
import { DEFAULTSTATE, LABELS } from '../constants/log';

type Props = {
  resource: string,
  messages: Array<string>,
  onClearClick: Function,
  onSearchChange: Function,
  defaultSearchValue: string,
  heightUpdater: ?Function,
  height: number | string,
};

const LogContainer: Function = (props: Props): React.Element<any> => (
  <Log {...props} />
);

const dataSelector: Function = (
  state: Object,
  props: Object
): Object => state.log.data[props.url] || DEFAULTSTATE;

const filterMessages: Function = (
  query: string
): Function => (
  messages: Array<string>
): Array<string> => (
  query ? messages.filter((m:string) => includes(m, query)) : messages
);

const messagesSelector: Function = createSelector(
  [
    dataSelector,
    querySelector('logQuery'),
  ], (data, query) => flowRight(
    filterMessages(query)
  )(data.messages)
);

const containerSelector: Function = createSelector(
  [
    messagesSelector,
    querySelector('logQuery'),
  ], (messages, query) => ({
    messages,
    query,
  })
);

export default compose(
  withState(
    'height',
    'updateHeight',
    (props: Object) => props.height || 'auto'
  ),
  mapProps((props: Object): Object => ({
    ...props,
    url: `log/${props.resource}`,
    calculateHeight: (): Function => props.updateHeight((n: number): number => (
      props.heightUpdater ? props.heightUpdater(n) : props.height
    )),
  })),
  connect(
    containerSelector,
    {
      update: actions.onMessage,
      init: actions.init,
      disconnect: actions.onDisconnect,
      clear: actions.clear,
    }
  ),
  websocket(
    {
      onOpen: 'init',
      onMessage: 'update',
      onDisconnect: 'disconnect',
    }
  ),
  withHandlers({
    onClearClick: (props: Object): Function => (): void => {
      props.clear(props.url);
      props.update(props.url, LABELS.cleared);
    },
  }),
  lifecycle({
    componentWillMount() {
      this.props.calculateHeight();

      window.addEventListener('resize', () => {
        this.props.calculateHeight();
      });
    },
    componentWillUnmount() {
      window.removeEventListener('resize', () => {
        this.props.calculateHeight();
      });
    },
  }),
  search('logQuery')
)(LogContainer);
