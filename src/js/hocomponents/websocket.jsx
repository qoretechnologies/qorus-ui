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
  const { data } = state.ws;

  if (!data[props.url]) {
    return DEFAULTSTATE;
  }

  return data[props.url];
};

const selector: Function = createSelector(
  [connectionSelector],
  (conn: Object) => ({
    connected: conn.connected,
    loading: conn.loading,
    error: conn.error,
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

    getFunc: Function = (props: Object): Function => (funcName): ?string => {
      if (!funcs[funcName]) return null;

      const func: any = funcs[funcName];

      return props[func] || func;
    };

    handleConnect: Function = (props: Object = this.props): Function => (
      resume: boolean = false
    ): void => {
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

  ComponentWithWebsocket.displayName = wrapDisplayName(Component, 'WebSocket');

  return ComponentWithWebsocket;
};
