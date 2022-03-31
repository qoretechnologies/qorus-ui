// @flow
import React, { Component } from 'react';
import yaml from 'js-yaml';
import { connect } from 'react-redux';

import Modal from '../../../../components/modal';
import Box from '../../../../components/box';
import PaneItem from '../../../../components/pane_item';
import settings from '../../../../settings';
import { fetchJson, fetchWithNotifications } from '../../../../store/api/utils';
import {
  Controls as ButtonGroup,
  Control as Button,
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
} from '../../../../components/controls';
import Dropdown, { Item, Control } from '../../../../components/dropdown';

@connect()
export default class ModalRun extends Component {
  props: {
    method: Object,
    service: Object,
    response: Object,
    onClose: Function,
    dispatch: Function,
  } = this.props;

  state = {
    activeMethod: this.props.method,
    response: false,
    error: null,
    requestHeight: null,
    responseHeight: null,
    responseType: 'YAML',
  };

  _request;
  _response;

  handleCancel = ev => {
    ev.preventDefault();
    this.props.onClose();
  };

  // @ts-expect-error ts-migrate(2355) FIXME: A function whose declared type is neither 'void' n... Remove this comment to see the full error message
  handleCommit = async (ev): Promise<Object> => {
    const request = this._request.value;
    const { service, dispatch } = this.props;
    const { activeMethod } = this.state;

    ev.preventDefault();

    this.setState({
      response: null,
    });

    const response = await fetchWithNotifications(
      async () =>
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 5 arguments, but got 3.
        await fetchJson(
          'PUT',
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
          `${settings.REST_BASE_URL}/services/${service.name}/${
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
            activeMethod.name
          }`,
          { body: JSON.stringify({ action: 'call', parse_args: request }) }
        ),
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
      `'Executing ${activeMethod.name}...`,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
      `${activeMethod.name} successfuly executed`,
      dispatch
    );

    if (response.err && response.desc) {
      this.setState({
        error: true,
        response: response.desc,
      });
    } else {
      this.setState({
        response,
        error: null,
      });
    }
  };

  handleMethodChange = (ev: Object, methodName: string): void => {
    this.setState({
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'methods' does not exist on type 'Object'... Remove this comment to see the full error message
      activeMethod: this.props.service.methods.find(
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        (method: Object): boolean => method.name === methodName
      ),
    });
  };

  handleResponseTypeChange = (ev: Object, responseType: string): void => {
    this.setState({
      responseType,
    });
  };

  handleModalResize = () => {
    if (this._request && this._response) {
      const { height: formHeight } = document
        .querySelectorAll('.method-form')[0]
        .getBoundingClientRect();
      const { height: bodyHeight } = document
        .querySelectorAll('.bp3-dialog-body')[0]
        .getBoundingClientRect();
      const difference = bodyHeight - formHeight;

      const { height: requestHeight } = this._request.getBoundingClientRect();
      const { height: responseHeight } = this._response.getBoundingClientRect();

      this.setState({
        requestHeight: requestHeight + difference / 2 - 20,
        responseHeight: responseHeight + difference / 2 - 20,
      });
    }
  };

  requestRef = s => {
    this._request = s;
  };

  respRef = el => {
    if (el) {
      this._response = el;
    }
  };

  /**
   * @return {ReactElement}
   */
  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'request' does not exist on type '{ activ... Remove this comment to see the full error message
    const { response, request, activeMethod, error, responseType } = this.state;
    const { service } = this.props;

    return (
      <Modal hasFooter onResizeStop={this.handleModalResize}>
        <Modal.Header
          titleId="errorsTableModalLabel"
          onClose={this.handleCancel}
        >
          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'. */ }
          Method execution for {service.name} service
        </Modal.Header>
        <Modal.Body>
          <Box top>
            <form
              onSubmit={this.handleCommit}
              noValidate
              className="method-form"
            >
              <PaneItem
                title="Method"
                label={
                  // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                  <Dropdown>
                    { /* @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: any; small: true; }' is missing ... Remove this comment to see the full error message */ }
                    <Control small>{activeMethod.name}</Control>
                    { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'methods' does not exist on type 'Object'... Remove this comment to see the full error message */ }
                    {service.methods.map(
                      // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                      (method: Object): React.Element<Item> => (
                        <Item
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                          key={method.name}
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                          title={method.name}
                          // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                          onClick={this.handleMethodChange}
                        />
                      )
                    )}
                  </Dropdown>
                }
              >
                { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'description' does not exist on type 'Obj... Remove this comment to see the full error message */ }
                <p className="text-muted">{activeMethod.description}</p>
              </PaneItem>

              { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'textWrapRef' does not exist on type 'Mod... Remove this comment to see the full error message */ }
              <div ref={this.textWrapRef}>
                <div style={{ overflow: 'hidden' }}>
                  <PaneItem title="Arguments">
                    <textarea
                      id="args"
                      name="args"
                      className="bp3-input bp3-fill"
                      // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'number'.
                      rows="5"
                      ref={this.requestRef}
                      defaultValue={request || ''}
                      style={{
                        height: this.state.requestHeight || 'auto',
                      }}
                    />
                  </PaneItem>
                </div>
                <PaneItem
                  title="Response"
                  label={
                    // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                    <Dropdown>
                      { /* @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: string; small: true; }' is missi... Remove this comment to see the full error message */ }
                      <Control small>{responseType}</Control>
                      <Item
                        title="YAML"
                        // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                        onClick={this.handleResponseTypeChange}
                      />
                      <Item
                        title="JSON"
                        // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                        onClick={this.handleResponseTypeChange}
                      />
                    </Dropdown>
                  }
                >
                  <textarea
                    className={`bp3-input bp3-fill ${
                      error
                        ? 'bp3-intent-danger'
                        : response
                        ? 'bp3-intent-success'
                        : ''
                    }`}
                    placeholder="Response"
                    readOnly
                    // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'number'.
                    rows="5"
                    ref={this.respRef}
                    value={
                      response
                        ? responseType === 'YAML'
                          ? yaml.dump(response)
                          : JSON.stringify(response, null, 4)
                        : ''
                    }
                    style={{
                      height: this.state.responseHeight || 'auto',
                    }}
                  />
                </PaneItem>
              </div>
            </form>
          </Box>
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup>
            <Button onClick={this.handleCancel} icon="cross" big>
              Cancel
            </Button>
            <Button
              type="submit"
              btnStyle="success"
              big
              onClick={this.handleCommit}
              icon="small-tick"
            >
              Call
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal>
    );
  }
}
