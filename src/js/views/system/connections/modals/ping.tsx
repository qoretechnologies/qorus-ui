/* @flow */
import React, { Component } from 'react';
import Modal from '../../../../components/modal';
import Alert from '../../../../components/alert';

// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Controls, Control as Button } from '../../../../components/controls';

import actions from '../../../../store/api/actions';
import { connect } from 'react-redux';
import Box from '../../../../components/box';
import { Spinner, Intent, Icon } from '@blueprintjs/core';
import withDispatch from '../../../../hocomponents/withDispatch';

@withDispatch()
export default class Ping extends Component {
  props: {
    pingRemote?: Function,
    name: string,
    onClose: Function,
    type: string,
  } = this.props;

  state: {
    error: boolean,
    // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    data: ?Object,
  } = {
    error: false,
    data: null,
  };

  componentWillMount() {
    this.ping();
  }

  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  ping: Function = async (): Promise<*> => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatchAction' does not exist on type '... Remove this comment to see the full error message
    if (this.props.dispatchAction) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatchAction' does not exist on type '... Remove this comment to see the full error message
      const payload: Object = await this.props.dispatchAction(
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'remotes' does not exist on type '{}'.
        actions.remotes.pingRemote,
        this.props.name,
        this.props.type
      );

      this.setState({
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'error' does not exist on type 'Object'.
        error: payload.error,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
        data: payload.payload,
      });
    }
  };

  renderBody() {
    if (!this.state.data) {
      return (
        <Box top>
          <Spinner className="bp3-small" />
        </Box>
      );
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'ok' does not exist on type 'Object'.
    if (this.state.error || !this.state.data.ok) {
      return (
        <Box top>
          <Alert bsStyle="danger" title="Ping unsuccessful">
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'info' does not exist on type 'Object'.
            {this.state.data.info}
          </Alert>
        </Box>
      );
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'url' does not exist on type 'Object'.
    const { url, result } = this.state.data;

    return (
      <Box top>
        <Alert bsStyle="success" title="Ping successful">
          The ping request against {url} took <strong>{result}</strong>.
        </Alert>
      </Box>
    );
  }

  render() {
    return (
      <Modal hasFooter>
        <Modal.Header titleId="ping" onClose={this.props.onClose}>
          Pinging {this.props.name}
        </Modal.Header>
        <Modal.Body>{this.renderBody()}</Modal.Body>
        <Modal.Footer>
          <Controls noControls grouped>
            <Button
              label="Close"
              btnStyle="default"
              action={this.props.onClose}
              big
            />
            <Button
              label="Try again"
              btnStyle="success"
              action={this.ping}
              big
            />
          </Controls>
        </Modal.Footer>
      </Modal>
    );
  }
}
