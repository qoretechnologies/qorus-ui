import { Component } from 'react';
import { connect } from 'react-redux';
import Alert from '../../../../components/alert';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { ReqoreModal, useReqoreProperty } from '@qoretechnologies/reqore';
import { Control as Button, Controls } from '../../../../components/controls';
import { CONN_MAP } from '../../../../constants/remotes';
import withDispatch from '../../../../hocomponents/withDispatch';
import actions from '../../../../store/api/actions';
import Options from '../options';

type Props = {
  onClose: () => void;
  optimisticDispatch: Function;
  edit?: boolean;
  remoteType: string;
  originalName?: string;
  handleFormSubmit?: Function;
  handleSaveClick?: Function;
  user?: string;
  type?: string;
  pass?: string;
  name?: string;
  db?: string;
  charset?: string;
  host?: string;
  port?: string;
  options?: any;
  opts?: any;
  remotes?: Array<Object>;
  desc?: string;
  url?: string;
};

const ConfirmControls = ({ onClose, onSubmit, hasUnsavedOptions }) => {
  const confirmAction = useReqoreProperty('confirmAction');

  const handleSubmit = () => {
    if (hasUnsavedOptions) {
      confirmAction({
        title: 'Unsaved options',
        description: 'You have unsaved options. Are you sure you want to continue?',
        confirmLabel: 'Continue',
        cancelLabel: 'Cancel',
        onConfirm: onSubmit,
        intent: 'warning',
      });
    } else {
      onSubmit();
    }
  }

  return <Controls noControls grouped>
              <Button big btnStyle="default" label="Cancel" onClick={onClose} />
              <Button big btnStyle={hasUnsavedOptions ? "warning" : "success"} label="Save" type="submit" onClick={handleSubmit} />
            </Controls>
}

@connect((state: any) => ({
  // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
  remotes: state.api.remotes.data,
}))
@withDispatch()
class ManageModal extends Component {
  props: Props = this.props;

  state: {
    hasUnsavedOptions: boolean;
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    error: string;
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    options: string;
  } = {
    error: null,
    options: '',
    hasUnsavedOptions: false,
  };

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleFormSubmit: Function = (event: EventHandler): void => {
    event?.preventDefault();

    // @ts-ignore ts-migrate(2339) FIXME: Property 'dispatchAction' does not exist on type '... Remove this comment to see the full error message
    const { dispatchAction, remoteType, remotes, onClose, edit } = this.props;
    const data = Object.keys(this.refs).reduce(
      (cur: any, ref: string): any => ({
        ...cur,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
        ...{ [ref]: this.refs[ref].value },
      }),
      {}
    );

    // @ts-ignore ts-migrate(2339) FIXME: Property 'opts' does not exist on type 'Object'.
    data.opts =
      this.state.options === '' || this.state.options === '{}' ? null : this.state.options;

    try {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'opts' does not exist on type 'Object'.
      if (data.opts && data.opts !== '') {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'opts' does not exist on type 'Object'.
        JSON.parse(data.opts);
      }
    } catch (e) {
      this.setState({
        error: 'The "options" value must be in valid JSON string format!',
      });
    } finally {
      // @ts-ignore ts-migrate(2696) FIXME: The 'Object' type is assignable to very few other ... Remove this comment to see the full error message
      const exists: Array<Object> =
        remotes &&
        remotes.find(
          (remote: any): boolean =>
            // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
            remote.name === data.name &&
            // @ts-ignore ts-migrate(2339) FIXME: Property 'conntype' does not exist on type 'Object... Remove this comment to see the full error message
            remote.conntype === CONN_MAP[remoteType]
        );

      if (exists && !edit) {
        this.setState({
          error: `A ${remoteType} with this name already exists.`,
        });
      } else {
        let proceed = true;

        // @ts-ignore ts-migrate(2339) FIXME: Property 'opts' does not exist on type 'Object'.
        if (data.opts && data.opts !== '') {
          // @ts-ignore ts-migrate(2339) FIXME: Property 'opts' does not exist on type 'Object'.
          data.opts = JSON.parse(data.opts);

          // @ts-ignore ts-migrate(2339) FIXME: Property 'opts' does not exist on type 'Object'.
          Object.keys(data.opts).forEach(
            // @ts-ignore ts-migrate(2355) FIXME: A function whose declared type is neither 'void' n... Remove this comment to see the full error message
            (key: string): any => {
              // @ts-ignore ts-migrate(2339) FIXME: Property 'opts' does not exist on type 'Object'.
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
            // @ts-ignore ts-migrate(2339) FIXME: Property 'remotes' does not exist on type '{}'.
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

  handleOptionsSave: Function = (options: any) => {
    this.setState({ options, hasUnsavedOptions: false });
  };

  render() {
    const { onClose, edit, name, opts, desc, url } = this.props;

    return (
      <ReqoreModal isOpen label={edit ? 'Edit connection' : 'Add connection'} onClose={onClose} bottomActions={[{
        as: ConfirmControls,
        position: 'right',
        props: { onClose, onSubmit: this.handleFormSubmit, hasUnsavedOptions: this.state.hasUnsavedOptions },
      }]} width='500px'>
            {this.state.error && <Alert bsStyle="danger">{this.state.error}</Alert>}
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
                    // @ts-ignore ts-migrate(2322) FIXME: Type 'string | boolean' is not assignable to type ... Remove this comment to see the full error message
                    readOnly={edit ? 'readonly' : false}
                    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'boolean'.
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
                    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'boolean'.
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
                    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'boolean'.
                    required="required"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-lg-4 control-label" htmlFor="options">
                  Options *
                </label>
                <div className="col-lg-6">
                  {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
                  <Options canEdit data={opts} onSave={this.handleOptionsSave} onChange={() => this.setState({ hasUnsavedOptions: true })} />
                </div>
              </div>
            </div>

      </ReqoreModal>
    );
  }
}

export default ManageModal;
