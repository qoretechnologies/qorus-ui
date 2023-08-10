import { useState } from 'react';
import { connect } from 'react-redux';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import {
  ReqoreButton,
  ReqoreControlGroup,
  ReqoreInput,
  ReqoreMessage,
  ReqoreModal,
  ReqoreP,
  useReqoreProperty,
} from '@qoretechnologies/reqore';
import { compose } from 'recompose';
import { extractProtocol } from '../../../../components/Field/validations';
import { CONN_MAP } from '../../../../constants/remotes';
import withDispatch from '../../../../hocomponents/withDispatch';
import actions from '../../../../store/api/actions';
import Options from '../options';

type Props = {
  onClose: () => void;
  optimisticDispatch: Function;
  dispatchAction: Function;
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

const ConfirmControls = ({ onClose, onSubmit, hasUnsavedOptions, disabled }) => {
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
  };

  return (
    <ReqoreControlGroup>
      <ReqoreButton icon="CloseLine" label="Cancel" onClick={onClose} />
      <ReqoreButton
        intent={hasUnsavedOptions ? 'warning' : 'success'}
        label="Save"
        icon="CheckLine"
        onClick={handleSubmit}
        disabled={disabled}
      />
    </ReqoreControlGroup>
  );
};

const ConnecitonManageModal = ({ edit, onClose, ...rest }: Props) => {
  const [hasUnsavedOptions, setHasUnsavedOptions] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState(rest.opts);
  const [name, setName] = useState<string>(rest.name);
  const [description, setDescription] = useState<string>(rest.desc);
  const [url, setUrl] = useState<string>(rest.url);

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  const handleFormSubmit = (): void => {
    const { dispatchAction, remoteType, remotes } = rest;
    const data = {
      name,
      desc: description,
      url,
      opts: options,
    };

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
      setError(`A ${remoteType} with this name already exists.`);
    } else {
      dispatchAction(
        // @ts-ignore ts-migrate(2339) FIXME: Property 'remotes' does not exist on type '{}'.
        actions.remotes.manageConnection,
        remoteType,
        data,
        rest.name,
        onClose
      );
    }
  };

  const handleOptionsSave = (options: any) => {
    setOptions(JSON.parse(options));
    setHasUnsavedOptions(false);
  };

  const isDataValid = () => {
    return name && description && url;
  };

  return (
    <ReqoreModal
      isOpen
      blur={2}
      label={edit ? 'Edit connection' : 'Add connection'}
      onClose={onClose}
      bottomActions={[
        {
          as: ConfirmControls,
          position: 'right',
          props: {
            disabled: !isDataValid(),
            onClose,
            onSubmit: handleFormSubmit,
            hasUnsavedOptions,
          },
        },
      ]}
      width="800px"
    >
      {error && (
        <ReqoreMessage intent="danger" margin="both">
          {error}
        </ReqoreMessage>
      )}

      <ReqoreP>Name</ReqoreP>
      <ReqoreInput value={name} readOnly={edit} onChange={(e: any) => setName(e.target.value)} />
      <ReqoreP>Description</ReqoreP>
      <ReqoreInput value={description} onChange={(e: any) => setDescription(e.target.value)} />
      <ReqoreP>URL</ReqoreP>
      <ReqoreInput value={url} onChange={(e: any) => setUrl(e.target.value)} />
      {url ? (
        <Options
          canEdit
          data={options}
          onSave={handleOptionsSave}
          onChange={() => setHasUnsavedOptions(true)}
          urlProtocol={extractProtocol(url)}
        />
      ) : (
        <ReqoreMessage intent="warning" margin="both" title="Options">
          Please enter a valid URL to enable options
        </ReqoreMessage>
      )}
    </ReqoreModal>
  );
};

export default compose(
  connect((state: any) => ({
    // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
    remotes: state.api.remotes.data,
  })),
  withDispatch()
)(ConnecitonManageModal);
