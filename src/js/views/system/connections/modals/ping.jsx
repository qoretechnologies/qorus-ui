/* @flow */
import React, { Component } from 'react';
import Modal from '../../../../components/modal';
import Alert from '../../../../components/alert';

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
    data: ?Object,
  } = {
    error: false,
    data: null,
  };

  componentWillMount() {
    this.ping();
  }

  ping: Function = async (): Promise<*> => {
    if (this.props.dispatchAction) {
      const payload: Object = await this.props.dispatchAction(
        actions.remotes.pingRemote,
        this.props.name,
        this.props.type
      );

      this.setState({
        error: payload.error,
        data: payload.payload,
      });
    }
  };

  renderBody() {
    if (!this.state.data) {
      return (
        <Box top>
          <Spinner className="pt-small" />
        </Box>
      );
    }

    if (this.state.error || !this.state.data.ok) {
      return (
        <Box top>
          <Alert bsStyle="danger">{this.state.data.info}</Alert>
        </Box>
      );
    }

    const { url, result } = this.state.data;

    return (
      <Box top>
        <Icon iconName="small-tick" intent={Intent.SUCCESS} /> The ping request
        against {url} took <strong>{result}</strong>.
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
