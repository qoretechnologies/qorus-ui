import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from '../../../../components/modal';
import Alert from '../../../../components/alert';
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
  remotes: state.api.remotes.data,
}))
@withDispatch()
class ManageModal extends Component {
  props: Props = this.props;

  state: {
    error: ?string,
    options: ?string,
  } = {
    error: null,
    options: '',
  };

  handleFormSubmit: Function = (event: EventHandler): void => {
    event.preventDefault();

    const {
      optimisticDispatch,
      remoteType,
      originalName,
      remotes,
      onClose,
      edit,
    } = this.props;
    const data = Object.keys(this.refs).reduce(
      (cur: Object, ref: string): Object => ({
        ...cur,
        ...{ [ref]: this.refs[ref].value },
      }),
      {}
    );

    data.opts =
      this.state.options === '' || this.state.options === '{}'
        ? null
        : this.state.options;

    try {
      if (data.opts && data.opts !== '') {
        JSON.parse(data.opts);
      }
    } catch (e) {
      this.setState({
        error: 'The "options" value must be in valid JSON string format!',
      });
    } finally {
      const exists: ?Array<Object> =
        remotes &&
        remotes.find(
          (remote: Object): boolean =>
            remote.name === data.name &&
            remote.conntype === CONN_MAP[remoteType]
        );

      if (exists && !edit) {
        this.setState({
          error: `A ${remoteType} with this name already exists.`,
        });
      } else {
        let proceed = true;

        if (data.opts && data.opts !== '') {
          data.opts = JSON.parse(data.opts);

          Object.keys(data.opts).forEach(
            (key: string): Object => {
              proceed = typeof data.opts[key] === 'object' ? false : proceed;
            }
          );
        }

        if (!proceed) {
          this.setState({
            error: 'The "options" object is invalid. It cannot be nested.',
          });
        } else {
          optimisticDispatch(
            actions.remotes.manageConnection,
            remoteType,
            data,
            originalName
          );
          onClose();
        }
      }
    }
  };

  handleOptionsSave: Function = (options: Object) => {
    this.setState({ options });
  };

  render() {
    const {
      onClose,
      edit,
      remoteType,
      user,
      type,
      name,
      db,
      charset,
      port,
      host,
      options,
      opts,
      pass,
      desc,
      url,
    } = this.props;

    return (
      <Modal hasFooter>
        <Modal.Header titleId="manage" onClose={onClose}>
          {edit ? 'Edit connection' : 'Add connection'}
        </Modal.Header>
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
                    readOnly={edit ? 'readonly' : false}
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
                    required="required"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-lg-4 control-label" htmlFor="options">
                  Options *
                </label>
                <div className="col-lg-6">
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
