/* @flow */
import React from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';
import compose from 'recompose/compose';
import { connect as reduxConnect } from 'react-redux';
import { createSelector } from 'reselect';
import omit from 'lodash/omit';

import * as actions from '../store/websockets/actions';
import { DEFAULTSTATE } from '../constants/websockets';
import Alert from '../components/alert';

const connectionSelector: Function = (state: Object, props: Object): Object => {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'ws' does not exist on type 'Object'.
  const { data } = state.ws;

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'url' does not exist on type 'Object'.
  if (!data[props.url]) {
    return DEFAULTSTATE;
  }

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'url' does not exist on type 'Object'.
  return data[props.url];
};

// @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
const selector: Function = createSelector(
  [connectionSelector],
  (conn: Object) => ({
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'connected' does not exist on type 'Objec... Remove this comment to see the full error message
    connected: conn.connected,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'loading' does not exist on type 'Object'... Remove this comment to see the full error message
    loading: conn.loading,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'error' does not exist on type 'Object'.
    error: conn.error,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'paused' does not exist on type 'Object'.
    paused: conn.paused,
  })
);

/**
 * A high-order component that provides an easy access to
 * websockets
 */
export default (
  funcs: Object,
  showLoading: boolean = true,
  showError: boolean = true,
  showDisconnect: boolean = true
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
): Function => (Component: ReactClass<*>): ReactClass<*> => {
  @compose(
    reduxConnect(selector, {
      connect: actions.connect,
      disconnect: actions.disconnect,
    })
  )
  class ComponentWithWebsocket extends React.Component {
    props: {
      connected: boolean,
      loading: boolean,
      error: Object,
      paused: boolean,
      connect: Function,
      disconnect: Function,
      url: string,
    } = this.props;

    componentWillMount() {
      this.handleConnect()();
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.url !== nextProps.url) {
        this.handleDisconnect()();
        this.handleConnect(nextProps)();
      }
    }

    componentWillUnmount() {
      this.handleDisconnect()();
    }

    // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    getFunc: Function = (props: Object): Function => (funcName): ?string => {
      if (!funcs[funcName]) return null;

      const func: any = funcs[funcName];

      return props[func] || func;
    };

    handleConnect: Function = (props: Object = this.props): Function => (
      resume: boolean = false
    ): void => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'connected' does not exist on type 'Objec... Remove this comment to see the full error message
      const { connected, loading, url, connect } = props;
      const getFunc = this.getFunc(props);

      if (!connected && !loading) {
        connect(
          url,
          resume ? getFunc('onResume') : getFunc('onOpen'),
          getFunc('onMessage'),
          getFunc('onError'),
          getFunc('onClose'),
          getFunc('onPause')
        );
      }
    };

    handleDisconnect: Function = (props: Object = this.props): Function => (
      pause: boolean = false
    ): void => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'disconnect' does not exist on type 'Obje... Remove this comment to see the full error message
      const { disconnect, connected, url } = props;

      if (connected) disconnect(url, pause);
    };

    handlePause: Function = (props: Object): Function => (): void => {
      this.handleDisconnect(props)(true);
    };

    handleResume: Function = (props: Object): Function => (): void => {
      this.handleConnect(props)(true);
    };

    render() {
      const { connected, loading, paused, error } = this.props;

      if (error && showError) {
        return <Alert bsStyle="danger">{error}</Alert>;
      }

      if (loading && showLoading) {
        return <Alert bsStyle="info"> Establishing connection... </Alert>;
      }

      if (!connected && !paused && showDisconnect) {
        return <Alert bsStyle="warning"> Connection closed. </Alert>;
      }

      const newProps = omit(this.props, [
        'connect',
        'disconnect',
        'loading',
        'error',
        'connected',
      ]);

      return (
        <Component
          wsConnect={this.handleConnect()}
          wsDisconnect={this.handleDisconnect()}
          wsPause={this.handlePause()}
          wsResume={this.handleResume()}
          {...newProps}
        />
      );
    }
  }

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'displayName' does not exist on type 'typ... Remove this comment to see the full error message
  ComponentWithWebsocket.displayName = wrapDisplayName(Component, 'WebSocket');

  return ComponentWithWebsocket;
};
