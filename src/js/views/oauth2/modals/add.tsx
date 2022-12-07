// @flow
import {
  ReqoreButton,
  ReqoreControlGroup,
  ReqoreDropdown,
  ReqoreInput,
  ReqoreModal,
  ReqoreTag,
  ReqoreTagGroup,
} from '@qoretechnologies/reqore';
import { IReqoreButtonProps } from '@qoretechnologies/reqore/dist/components/Button';
import { IReqoreDropdownItem } from '@qoretechnologies/reqore/dist/components/Dropdown/list';
import { size } from 'lodash';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import SubField from '../../../components/Field/subfield';
import { validateField } from '../../../components/Field/validations';
import Spacer from '../../../components/Spacer';

type AddClientModalProps = {};

const AddClientModal: Function = ({
  onClose,
  handleFormSubmit,
  handleClientDescriptionChange,
  handlePermissionsChange,
  clientDescription,
  permissions,
  userPermissions,
  handleAllPermissionsClick,
  data,
}: any) => {
  const addOrRemovePermission = (permission: string) => {
    console.log(permissions);
    if (permissions.includes(permission)) {
      handlePermissionsChange(permissions.filter((p: string) => p !== permission));
    } else {
      handlePermissionsChange([...permissions, permission]);
    }
  };

  const items = [...userPermissions].map(
    (permission): IReqoreDropdownItem => ({
      value: permission,
      selected: permissions.includes(permission),
      onClick: ({ value }) => {
        addOrRemovePermission(value);
      },
    })
  );

  return (
    <ReqoreModal
      isOpen
      label="Add new client"
      blur={5}
      onClose={onClose}
      bottomActions={[
        {
          label: 'Cancel',
          onClick: onClose,
          position: 'left',
        },
        {
          label: 'Save',
          intent: 'success',
          position: 'right',
          onClick:
            validateField('string', clientDescription) && validateField('array', permissions)
              ? handleFormSubmit
              : undefined,
        },
      ]}
    >
      <SubField title={'Client Description'}>
        <ReqoreInput
          value={clientDescription}
          onChange={handleClientDescriptionChange}
          intent={validateField('string', clientDescription) ? undefined : 'danger'}
          onClearClick={() => handleClientDescriptionChange({ target: { value: '' } })}
        />
      </SubField>
      <Spacer size={10} />
      <SubField title="Scopes">
        {size(permissions) ? (
          <ReqoreTagGroup size="small">
            {permissions.map((p) => (
              <ReqoreTag label={p} onRemoveClick={() => addOrRemovePermission(p)} size="small" />
            ))}
          </ReqoreTagGroup>
        ) : null}
        <ReqoreControlGroup stack>
          <ReqoreDropdown<IReqoreButtonProps>
            filterable
            multiSelect
            intent={validateField('array', permissions) ? undefined : 'danger'}
            label="Select scopes"
            items={items}
          />
          <ReqoreButton
            onClick={handleAllPermissionsClick}
            disabled={size(permissions) === size(userPermissions)}
          >
            Select all
          </ReqoreButton>
          <ReqoreButton
            onClick={() => handlePermissionsChange([])}
            disabled={size(permissions) === 0}
          >
            Remove all
          </ReqoreButton>
        </ReqoreControlGroup>
      </SubField>
    </ReqoreModal>
  );
};

export default compose(
  withState('clientId', 'changeClientId', ({ data }) => data?.clientId || ''),
  withState(
    'clientDescription',
    'changeClientDescription',
    ({ data }) => data?.clientDescription || ''
  ),
  withState('clientSecret', 'changeClientSecret', ({ data }) => data?.clientSecret || ''),
  withState('permissions', 'changePermissions', ({ data }) => data?.permissions || []),
  withHandlers({
    handleClientDescriptionChange:
      ({ changeClientDescription }): Function =>
      (event: any): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'target' does not exist on type 'Object'.
        const { value } = event.target;

        changeClientDescription(() => value);
      },
    handleClientSecretChange:
      ({ changeClientSecret }): Function =>
      (event: any): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'target' does not exist on type 'Object'.
        const { value } = event.target;

        changeClientSecret(() => value);
      },
    handlePermissionsChange:
      ({ changePermissions }): Function =>
      (newPermissions: Array<string>): void => {
        changePermissions(() => newPermissions);
      },
    handleFormSubmit:
      ({ clientId, clientDescription, clientSecret, permissions, onSubmit }): Function =>
      (event: any): void => {
        event?.preventDefault();
        onSubmit(clientId, clientDescription, clientSecret, permissions);
      },
  }),
  withHandlers({
    handleAllPermissionsClick:
      ({ userPermissions, handlePermissionsChange }): Function =>
      (): void => {
        handlePermissionsChange(userPermissions);
      },
  })
)(AddClientModal);
