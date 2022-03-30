import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from '../../../../components/modal';
import Alert from '../../../../components/alert';
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Controls, Control as Button } from '../../../../components/controls';
import actions from '../../../../store/api/actions';
import { CONN_MAP } from '../../../../constants/remotes';
import Options from '../options';
import withDispatch from '../../../../hocomponents/withDispatch';

type Props = {
  onClose: Function,
  optimisticDispatch: Function,
  edit?: boolean,
  remoteType: string,
  originalName?: string,
  handleFormSubmit?: Function,
  handleSaveClick?: Function,
  user?: string,
  type?: string,
  pass?: string,
  name?: string,
  db?: string,
  charset?: string,
  host?: string,
  port?: string,
  options?: Object,
  opts?: Object,
  remotes?: Array<Object>,
  desc?: string,
  url?: string,
};

@connect((state: Object) => ({
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
  remotes: state.api.remotes.data,
}))
@withDispatch()
class ManageModal extends Component {
  props: Props = this.props;

  state: {
    // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    error: ?string,
    // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    options: ?string,
  } = {
    error: null,
    options: '',
  };

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleFormSubmit: Function = (event: EventHandler): void => {
    event.preventDefault();

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatchAction' does not exist on type '... Remove this comment to see the full error message
    const { dispatchAction, remoteType, remotes, onClose, edit } = this.props;
    const data = Object.keys(this.refs).reduce(
      (cur: Object, ref: string): Object => ({
        ...cur,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
        ...{ [ref]: this.refs[ref].value },
      }),
      {}
    );

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'opts' does not exist on type 'Object'.
    data.opts =
      this.state.options === '' || this.state.options === '{}'
        ? null
        : this.state.options;

    try {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'opts' does not exist on type 'Object'.
      if (data.opts && data.opts !== '') {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'opts' does not exist on type 'Object'.
        JSON.parse(data.opts);
      }
    } catch (e) {
      this.setState({
        error: 'The "options" value must be in valid JSON string format!',
      });
    } finally {
      // @ts-expect-error ts-migrate(2696) FIXME: The 'Object' type is assignable to very few other ... Remove this comment to see the full error message
      const exists: ?Array<Object> =
        remotes &&
        remotes.find(
          (remote: Object): boolean =>
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
            remote.name === data.name &&
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'conntype' does not exist on type 'Object... Remove this comment to see the full error message
            remote.conntype === CONN_MAP[remoteType]
        );

      if (exists && !edit) {
        this.setState({
          error: `A ${remoteType} with this name already exists.`,
        });
      } else {
        let proceed = true;

        // @ts-expect-error ts-migrate(2339) FIXME: Property 'opts' does not exist on type 'Object'.
        if (data.opts && data.opts !== '') {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'opts' does not exist on type 'Object'.
          data.opts = JSON.parse(data.opts);

          // @ts-expect-error ts-migrate(2339) FIXME: Property 'opts' does not exist on type 'Object'.
          Object.keys(data.opts).forEach(
            // @ts-expect-error ts-migrate(2355) FIXME: A function whose declared type is neither 'void' n... Remove this comment to see the full error message
            (key: string): Object => {
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'opts' does not exist on type 'Object'.
              proceed = typeof data.opts[key] === 'object' ? false : proceed;
            }
          );
        }

        if (!proceed) {
          this.setState({
            error: 'The "options" object is invalid. It cannot be nested.',
          });
        } else {
          dispatchAction(
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'remotes' does not exist on type '{}'.
            actions.remotes.manageConnection,
            remoteType,
            data,
            null,
            onClose
          );
        }
      }
    }
  };

  handleOptionsSave: Function = (options: Object) => {
    this.setState({ options });
  };

  render () {
    const { onClose, edit, name, opts, desc, url } = this.props;

    return (
      <Modal hasFooter>
        <Modal.Header titleId="manage" onClose={onClose}>
          {edit ? 'Edit connection' : 'Add connection'}
        </Modal.Header>
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
        <form onSubmit={this.handleFormSubmit} className="form-horizontal">
          <Modal.Body>
            {this.state.error && (
              <Alert bsStyle="danger">{this.state.error}</Alert>
            )}
            <div>
              <div className="form-group">
                <label className="col-lg-4 control-label" htmlFor="name">
                  Name *
                </label>
                <div className="col-lg-6">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="form-control"
                    defaultValue={name}
                    ref="name"
                    // @ts-expect-error ts-migrate(2322) FIXME: Type 'string | boolean' is not assignable to type ... Remove this comment to see the full error message
                    readOnly={edit ? 'readonly' : false}
                    // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'boolean'.
                    required="required"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-lg-4 control-label" htmlFor="desc">
                  Description *
                </label>
                <div className="col-lg-6">
                  <input
                    type="text"
                    name="desc"
                    id="desc"
                    className="form-control"
                    defaultValue={desc}
                    ref="desc"
                    // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'boolean'.
                    required="required"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-lg-4 control-label" htmlFor="url">
                  URL *
                </label>
                <div className="col-lg-6">
                  <input
                    type="text"
                    name="url"
                    id="url"
                    className="form-control"
                    defaultValue={url}
                    ref="url"
                    // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'boolean'.
                    required="required"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-lg-4 control-label" htmlFor="options">
                  Options *
                </label>
                <div className="col-lg-6">
                  // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                  <Options
                    canEdit
                    data={opts}
                    onSave={this.handleOptionsSave}
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Controls noControls grouped>
              <Button big btnStyle="default" label="Cancel" onClick={onClose} />
              <Button big btnStyle="success" label="Save" type="submit" />
            </Controls>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}

export default ManageModal;
