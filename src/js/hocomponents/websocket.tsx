/* @flow */
import omit from 'lodash/omit';
import React from 'react';
import { connect as reduxConnect } from 'react-redux';
import compose from 'recompose/compose';
import wrapDisplayName from 'recompose/wrapDisplayName';
import { createSelector } from 'reselect';
import Alert from '../components/alert';
import { DEFAULTSTATE } from '../constants/websockets';
import * as actions from '../store/websockets/actions';

const connectionSelector: Function = (state: any, props: any): any => {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'ws' does not exist on type 'Object'.
  const { data } = state.ws;

  // @ts-ignore ts-migrate(2339) FIXME: Property 'url' does not exist on type 'Object'.
  if (!data[props.url]) {
    return DEFAULTSTATE;
  }

  // @ts-ignore ts-migrate(2339) FIXME: Property 'url' does not exist on type 'Object'.
  return data[props.url];
};

const infoSelector: Function = (state: any, props: any): any => {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'ws' does not exist on type 'Object'.
  const { data } = state.api.info;

  // @ts-ignore ts-migrate(2339) FIXME: Property 'url' does not exist on type 'Object'.
  return data?.noauth;
};

const selector: Function = createSelector(
  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
  [connectionSelector, infoSelector],
  (conn: any, noauth: boolean) => ({
    // @ts-ignore ts-migrate(2339) FIXME: Property 'connected' does not exist on type 'Objec... Remove this comment to see the full error message
    connected: conn.connected,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'loading' does not exist on type 'Object'... Remove this comment to see the full error message
    loading: conn.loading,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'error' does not exist on type 'Object'.
    error: conn.error,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'paused' does not exist on type 'Object'.
    paused: conn.paused,
    noauth,
  })
);

/**
 * A high-order component that provides an easy access to
 * websockets
 */
export default (
    funcs: any,
    showLoading: boolean = true,
    showError: boolean = true,
    showDisconnect: boolean = true
    // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
  ): Function =>
  (Component) => {
    @compose(
      reduxConnect(selector, {
        connect: actions.connect,
        disconnect: actions.disconnect,
      })
    )
    class ComponentWithWebsocket extends React.Component {
      props: {
        connected: boolean;
        loading: boolean;
        error: any;
        paused: boolean;
        connect: Function;
        disconnect: Function;
        url: string;
        noauth: boolean;
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

      // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
      getFunc: Function =
        (props: any): Function =>
        (funcName): string => {
          if (!funcs[funcName]) return null;

          const func: any = funcs[funcName];

          return props[func] || func;
        };

      handleConnect: Function =
        (props: any = this.props): Function =>
        (resume: boolean = false): void => {
          // @ts-ignore ts-migrate(2339) FIXME: Property 'connected' does not exist on type 'Objec... Remove this comment to see the full error message
          const { connected, loading, url, connect } = props;
          const getFunc = this.getFunc(props);

          if (!connected && !loading && (localStorage.getItem('token') || props.noauth)) {
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

      handleDisconnect: Function =
        (props: any = this.props): Function =>
        (pause: boolean = false): void => {
          // @ts-ignore ts-migrate(2339) FIXME: Property 'disconnect' does not exist on type 'Obje... Remove this comment to see the full error message
          const { disconnect, connected, url } = props;

          if (connected) disconnect(url, pause);
        };

      handlePause: Function =
        (props: any): Function =>
        (): void => {
          this.handleDisconnect(props)(true);
        };

      handleResume: Function =
        (props: any): Function =>
        (): void => {
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

    // @ts-ignore ts-migrate(2339) FIXME: Property 'displayName' does not exist on type 'typ... Remove this comment to see the full error message
    ComponentWithWebsocket.displayName = wrapDisplayName(Component, 'WebSocket');

    return ComponentWithWebsocket;
  };
