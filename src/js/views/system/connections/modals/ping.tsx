import { Spinner as _Spinner } from '@blueprintjs/core';
import { Component } from 'react';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { ReqoreMessage, ReqoreModal, ReqoreSpinner } from '@qoretechnologies/reqore';
import withDispatch from '../../../../hocomponents/withDispatch';
import actions from '../../../../store/api/actions';

const Spinner: any = _Spinner;

@withDispatch()
export default class Ping extends Component {
  props: {
    pingRemote?: Function;
    name: string;
    onClose: () => void;
    type: string;
  } = this.props;

  state: {
    error: boolean;
    data: any;
  } = {
    error: false,
    data: null,
  };

  componentWillMount() {
    this.ping();
  }

  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  ping: Function = async (): Promise<any> => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'dispatchAction' does not exist on type '... Remove this comment to see the full error message
    if (this.props.dispatchAction) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'dispatchAction' does not exist on type '... Remove this comment to see the full error message
      const payload: any = await this.props.dispatchAction(
        // @ts-ignore ts-migrate(2339) FIXME: Property 'remotes' does not exist on type '{}'.
        actions.remotes.pingRemote,
        this.props.name,
        this.props.type
      );

      this.setState({
        // @ts-ignore ts-migrate(2339) FIXME: Property 'error' does not exist on type 'Object'.
        error: payload.error,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
        data: payload.payload,
      });
    }
  };

  renderBody() {
    if (!this.state.data) {
      return (
        <ReqoreSpinner centered size="big">
          Pinging...
        </ReqoreSpinner>
      );
    }

    // @ts-ignore ts-migrate(2339) FIXME: Property 'ok' does not exist on type 'Object'.
    if (this.state.error || !this.state.data.ok) {
      return (
        <ReqoreMessage intent="danger" title="Ping unsuccessful">
          {this.state.data.info}
        </ReqoreMessage>
      );
    }

    // @ts-ignore ts-migrate(2339) FIXME: Property 'url' does not exist on type 'Object'.
    const { url, result } = this.state.data;

    return (
      <ReqoreMessage intent="success" title="Ping successful" opaque>
        The ping request against {url} took <strong>{result}</strong>.
      </ReqoreMessage>
    );
  }

  render() {
    return (
      <ReqoreModal
        isOpen
        onClose={this.props.onClose}
        label={`Pinging ${this.props.name}`}
        blur={2}
        bottomActions={[
          {
            label: 'Try again',
            intent: 'info',
            onClick: () => this.ping(),
            icon: 'GlobeLine',
            position: 'right',
          },
        ]}
      >
        {this.renderBody()}
      </ReqoreModal>
    );
  }
}
