import React, { Component, PropTypes } from 'react';
import yaml from 'js-yaml';
import { connect } from 'react-redux';

import Modal from '../../../../../components/modal';
import Alert from '../../../../../components/alert';
import Box from '../../../../../components/box';
import PaneItem from '../../../../../components/pane_item';
import settings from '../../../../../settings';
import {
  fetchJson,
  fetchWithNotifications,
} from '../../../../../store/api/utils';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../../../../components/controls';
import Dropdown, { Item, Control } from '../../../../../components/dropdown';

@connect()
export default class ModalRun extends Component {
  static propTypes = {
    method: PropTypes.object.isRequired,
    service: PropTypes.object.isRequired,
    response: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

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
        await fetchJson(
          'PUT',
          `${settings.REST_BASE_URL}/services/${service.name}/${
            activeMethod.name
          }`,
          { body: JSON.stringify({ action: 'call', parse_args: request }) }
        ),
      `'Executing ${activeMethod.name}...`,
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
      activeMethod: this.props.service.methods.find(
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
        .querySelectorAll('.pt-dialog-body')[0]
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
    const { response, request, activeMethod, error, responseType } = this.state;
    const { service } = this.props;

    return (
      <Modal hasFooter onResizeStop={this.handleModalResize}>
        <Modal.Header
          titleId="errorsTableModalLabel"
          onClose={this.handleCancel}
        >
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
                  <Dropdown>
                    <Control small>{activeMethod.name}</Control>
                    {service.methods.map(
                      (method: Object): React.Element<Item> => (
                        <Item
                          key={method.name}
                          title={method.name}
                          onClick={this.handleMethodChange}
                        />
                      )
                    )}
                  </Dropdown>
                }
              >
                <p className="text-muted">{activeMethod.description}</p>
              </PaneItem>

              <div ref={this.textWrapRef}>
                <div style={{ overflow: 'hidden' }}>
                  <PaneItem title="Arguments">
                    <textarea
                      id="args"
                      name="args"
                      className="pt-input pt-fill"
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
                    <Dropdown>
                      <Control small>{responseType}</Control>
                      <Item
                        title="YAML"
                        onClick={this.handleResponseTypeChange}
                      />
                      <Item
                        title="JSON"
                        onClick={this.handleResponseTypeChange}
                      />
                    </Dropdown>
                  }
                >
                  <textarea
                    className={`pt-input pt-fill ${
                      error
                        ? 'pt-intent-danger'
                        : response
                        ? 'pt-intent-success'
                        : ''
                    }`}
                    placeholder="Response"
                    readOnly
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
            <Button onClick={this.handleCancel} iconName="cross" big>
              Cancel
            </Button>
            <Button
              type="submit"
              btnStyle="success"
              big
              onClick={this.handleCommit}
              iconName="small-tick"
            >
              Call
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal>
    );
  }
}
