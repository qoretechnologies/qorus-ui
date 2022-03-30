// @flow
import React, { Component } from 'react';

import { fetchJson } from '../../store/api/utils';
import settings from '../../settings';
import Modal from '../modal';
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
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
    // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    data: ?string,
  } = {
    data: null,
  };

  // @ts-expect-error ts-migrate(1055) FIXME: Type 'any' is not a valid async function return ty... Remove this comment to see the full error message
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
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatchAction' does not exist on type '... Remove this comment to see the full error message
    this.props.dispatchAction(
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
      actions.orders.updateSensitiveData,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
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
              // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'number'.
              rows="8"
              // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'number'.
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
