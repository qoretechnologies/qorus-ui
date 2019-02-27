// @flow
import React, { Component } from 'react';

import { fetchJson } from '../../store/api/utils';
import settings from '../../settings';
import Modal from '../modal';
import { Controls, Control } from '../controls';
import actions from '../../store/api/actions';
import jsyaml from 'js-yaml';
import withDispatch from '../../hocomponents/withDispatch';

type Props = {
  onClose: Function,
  skey: string,
  svalue: string,
  id: number,
  updateSensitiveData: Function,
};

@withDispatch()
export default class SenstiveYamlEditModal extends Component {
  props: Props = this.props;

  state: {
    data: ?string,
  } = {
    data: null,
  };

  async componentWillMount (): any {
    const { id, skey, svalue }: Props = this.props;
    const urlAction: string = `action=yamlSensitiveData&skey=${skey}&svalue=${svalue}`;
    const data: Object = await fetchJson(
      'GET',
      `${settings.REST_BASE_URL}/orders/${id}?${urlAction}`,
      null,
      false,
      true
    );

    this.setState({
      data,
    });
  }

  handleSaveClick: Function = (): void => {
    this.props.dispatchAction(
      actions.orders.updateSensitiveData,
      this.refs.data.value,
      this.props.id,
      this.props.skey,
      this.props.svalue,
      this.props.onClose
    );
  };

  render () {
    return (
      <Modal hasFooter>
        <Modal.Header onClose={this.props.onClose} titleId="yamlEdit">
          Editing sensitive data
        </Modal.Header>
        <Modal.Body>
          {this.state.data ? (
            <textarea
              ref="data"
              className="form-control"
              defaultValue={jsyaml.safeDump(this.state.data)}
              rows="8"
              cols="50"
            />
          ) : (
            <p>Loading data...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="pull-right">
            <Controls grouped noControls>
              <Control
                label="Cancel"
                btnStyle="default"
                action={this.props.onClose}
                big
              />
              <Control
                label="Save"
                btnStyle="success"
                action={this.handleSaveClick}
                big
              />
            </Controls>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
}
