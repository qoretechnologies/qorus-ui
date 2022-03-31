// @flow
import React, { Component } from 'react';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control as Button, Controls } from '../../../components/controls';
import Modal from '../../../components/modal';
import withDispatch from '../../../hocomponents/withDispatch';
import actions from '../../../store/api/actions';

type Props = {
  onClose: Function;
  optimisticDispatch: Function;
};

@withDispatch()
export default class SLACreateModal extends Component {
  props: Props = this.props;

  handleFormSubmit: Function = (event: Object): void => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'preventDefault' does not exist on type '... Remove this comment to see the full error message
    event.preventDefault();

    const { form, name, desc } = this.refs;

    this.props.optimisticDispatch(
      // @ts-ignore ts-migrate(2339) FIXME: Property 'slas' does not exist on type '{}'.
      actions.slas.create,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
      name.value,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
      desc.value,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'units' does not exist on type 'ReactInst... Remove this comment to see the full error message
      form.units.value
    );
    this.props.onClose();
  };

  render() {
    return (
      <form
        className="form-horizontal"
        // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
        onSubmit={this.handleFormSubmit}
        ref="form"
      >
        <Modal hasFooter>
          <Modal.Header titleId="slacreate" onClose={this.props.onClose}>
            Create new SLA
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label htmlFor="name" className="col-sm-4 control-label">
                Name *
              </label>
              <div className="col-sm-6">
                <input
                  ref="name"
                  type="text"
                  className="form-control"
                  id="name"
                  // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'boolean'.
                  required="required"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="desc" className="col-sm-4 control-label">
                Description *
              </label>
              <div className="col-sm-6">
                <input
                  ref="desc"
                  type="text"
                  className="form-control"
                  id="desc"
                  // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'boolean'.
                  required="required"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="type" className="col-sm-4 control-label">
                Units *
              </label>
              <div className="col-sm-6">
                <label>
                  <input
                    name="units"
                    type="radio"
                    value="seconds"
                    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'boolean'.
                    required="required"
                  />{' '}
                  Seconds
                </label>{' '}
                <label>
                  <input
                    name="units"
                    type="radio"
                    value="other"
                    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'boolean'.
                    required="required"
                  />{' '}
                  Other
                </label>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="pull-right">
              <Controls noControls grouped>
                <Button label="Cancel" big btnStyle="default" onClick={this.props.onClose} />
                <Button label="Submit" big btnStyle="success" type="submit" />
              </Controls>
            </div>
          </Modal.Footer>
        </Modal>
      </form>
    );
  }
}
