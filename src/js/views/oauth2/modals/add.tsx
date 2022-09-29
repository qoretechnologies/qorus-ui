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
import { IReqoreDropdownItemProps } from '@qoretechnologies/reqore/dist/components/Dropdown/item';
import { size } from 'lodash';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import SubField from '../../../components/Field/subfield';
import { validateField } from '../../../components/Field/validations';
import Spacer from '../../../components/Spacer';

type AddClientModalProps = {};

const AddClientModal: Function = ({
  // @ts-ignore ts-migrate(2339) FIXME: Property 'onClose' does not exist on type 'AddClie... Remove this comment to see the full error message
  onClose,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'handleFormSubmit' does not exist on type... Remove this comment to see the full error message
  handleFormSubmit,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'handleClientIdChange' does not exist on ... Remove this comment to see the full error message
  handleClientIdChange,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'handleClientSecretChange' does not exist... Remove this comment to see the full error message
  handleClientSecretChange,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'handlePermissionsChange' does not exist ... Remove this comment to see the full error message
  handlePermissionsChange,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'clientId' does not exist on type 'AddCli... Remove this comment to see the full error message
  clientId,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'clientSecret' does not exist on type 'Ad... Remove this comment to see the full error message
  clientSecret,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'permissions' does not exist on type 'Add... Remove this comment to see the full error message
  permissions,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'userPermissions' does not exist on type ... Remove this comment to see the full error message
  userPermissions,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'handleAllPermissionsClick' does not exis... Remove this comment to see the full error message
  handleAllPermissionsClick,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'AddClientM... Remove this comment to see the full error message
  data,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
AddClientModalProps) => {
  const addOrRemovePermission = (permission: string) => {
    if (permissions.includes(permission)) {
      handlePermissionsChange(permissions.filter((p: string) => p !== permission));
    } else {
      handlePermissionsChange([...permissions, permission]);
    }
  };

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
            validateField('string', clientId) && validateField('array', permissions)
              ? handleFormSubmit
              : undefined,
        },
      ]}
    >
      <SubField title={'Client Name'}>
        <ReqoreInput
          value={clientId}
          onChange={handleClientIdChange}
          intent={validateField('string', clientId) ? undefined : 'danger'}
          onClearClick={() => handleClientIdChange({ target: { value: '' } })}
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
          <ReqoreDropdown
            multiSelect
            filterable
            componentProps={{
              intent: validateField('array', permissions) ? undefined : 'danger',
            }}
            label="Select scopes"
            items={userPermissions.map(
              (permission): IReqoreDropdownItemProps => ({
                label: permission,
                id: permission,
                selected: permissions.includes(permission),
                onClick(itemId?, event?) {
                  addOrRemovePermission(itemId);
                },
              })
            )}
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
  withState('clientSecret', 'changeClientSecret', ({ data }) => data?.clientSecret || ''),
  withState('permissions', 'changePermissions', ({ data }) => data?.permissions || []),
  withHandlers({
    handleClientIdChange:
      ({ changeClientId }): Function =>
      (event: any): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'target' does not exist on type 'Object'.
        const { value } = event.target;

        changeClientId(() => value);
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
      ({ clientId, clientSecret, permissions, onSubmit }): Function =>
      (event: any): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'preventDefault' does not exist on type '... Remove this comment to see the full error message
        event?.preventDefault();

        onSubmit(clientId, clientSecret, permissions);
      },
  }),
  withHandlers({
    handleAllPermissionsClick:
      ({ userPermissions, handlePermissionsChange }): Function =>
      (): void => {
        handlePermissionsChange(userPermissions);
      },
  }),
  onlyUpdateForKeys(['clientId', 'clientSecret', 'permissions'])
)(AddClientModal);
