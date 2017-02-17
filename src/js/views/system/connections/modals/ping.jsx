/* @flow */
import React, { Component } from 'react';
import Modal from '../../../../components/modal';
import Loader from '../../../../components/loader';
import Alert from '../../../../components/alert';
import AutoComponent from '../../../../components/autocomponent';
import Table, { Section, Row, Cell } from '../../../../components/table';
import { Controls, Control as Button } from '../../../../components/controls';

import actions from '../../../../store/api/actions';
import { connect } from 'react-redux';

@connect(
  state => state,
  {
    pingRemote: actions.remotes.pingRemote,
  }
)
export default class Ping extends Component {
  props: {
    pingRemote?: Function,
    name: string,
    onClose: Function,
    type: string,
  };

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
    if (this.props.pingRemote) {
      const payload: Object = await this.props.pingRemote(this.props.name, this.props.type);

      this.setState({
        error: payload.error,
        data: payload.payload,
      });
    }
  };

  renderBody() {
    if (!this.state.data) return <Loader />;

    if (this.state.error) {
      return (
        <Alert bsStyle="danger">
          { this.state.data.desc }
        </Alert>
      );
    }

    const { url, time, ok, info } = this.state.data;

    return (
      <Table className="table">
        <Section type="body">
          <Row>
            <Cell tag="th"> URL </Cell>
            <Cell>{ url }</Cell>
          </Row>
          <Row>
            <Cell tag="th"> Status </Cell>
            <Cell>
              <AutoComponent>
                { ok }
              </AutoComponent>
            </Cell>
          </Row>
          {!ok && (
            <Row>
              <Cell tag="th"> Error </Cell>
              <Cell> { info } </Cell>
            </Row>
          )}
          {ok && (
            <Row>
              <Cell tag="th"> Response Time </Cell>
              <Cell> { time } </Cell>
            </Row>
          )}
        </Section>
      </Table>
    );
  }

  render() {
    return (
      <Modal hasFooter>
        <Modal.Header
          titleId="ping"
          onClose={this.props.onClose}
        >
          Pinging { this.props.name }
        </Modal.Header>
        <Modal.Body>
          { this.renderBody() }
        </Modal.Body>
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
