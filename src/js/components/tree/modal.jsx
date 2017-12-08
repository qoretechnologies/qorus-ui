// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchJson } from '../../store/api/utils';
import settings from '../../settings';
import Modal from '../modal';
import { Controls, Control } from '../controls';
import actions from '../../store/api/actions';

type Props = {
  onClose: Function,
  skey: string,
  svalue: string,
  id: number,
  updateData: Function,
};

@connect(
  null,
  {
    updateData: actions.orders.updateData,
  }
)
export default class SenstiveYamlEditModal extends Component {
  props: Props;

  state: {
    data: ?string,
  } = {
    data: null,
  };

  async componentWillMount(): any {
    const { id, skey, svalue }: Props = this.props;
    const urlAction: string = `action=yamlSensitiveData&skey=${skey}&svalue=${svalue}`;
    const data: Object = await fetchJson(
      'GET',
      `${settings.REST_BASE_URL}/orders/${id}?${urlAction}`,
      null,
      false,
      true,
    );

    this.setState({
      data: data.data,
    });
  }

  handleSaveClick: Function = (): void => {
    this.props.updateData(
      'Sensitive',
      this.refs.data.value,
      this.props.id,
      this.props.skey,
      this.props.svalue
    );

    this.props.onClose();
  }

  render() {
    return (
      <Modal hasFooter>
        <Modal.Header
          onClose={this.props.onClose}
          titleId="yamlEdit"
        >
          Editing sensitive data
        </Modal.Header>
        <Modal.Body>
          {this.state.data ? (
            <textarea
              ref="data"
              className="form-control"
              defaultValue={this.state.data}
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
