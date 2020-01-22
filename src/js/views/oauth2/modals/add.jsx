// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Modal from '../../../components/modal';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../../components/controls';
import Pull from '../../../components/Pull';
import Box from '../../../components/box';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import { FormGroup, InputGroup } from '@blueprintjs/core';
import Flex from '../../../components/Flex';
import Dropdown, { Item, Control } from '../../../components/dropdown';

type AddClientModalProps = {};

const AddClientModal: Function = ({
  onClose,
  handleFormSubmit,
  handleClientIdChange,
  handleClientSecretChange,
  handlePermissionsChange,
  clientId,
  clientSecret,
  permissions,
  userPermissions,
  handleAllPermissionsClick,
  data,
}: AddClientModalProps): React.Element<any> => (
  <form onSubmit={handleFormSubmit}>
    <Modal hasFooter>
      <Modal.Header onClose={onClose}>Add new client</Modal.Header>
      <Modal.Body>
        <Box top fill scrollY>
          <Flex style={{ alignItems: 'center', justifyContent: 'center' }}>
            <FormGroup
              label="Client Name "
              labelFor="client-id"
              required
              requiredLabel
              inline
            >
              <InputGroup
                disabled={data}
                id="client-id"
                onChange={handleClientIdChange}
                value={clientId}
                className="bp3-fill"
              />
            </FormGroup>
            <FormGroup
              label="Client Secret "
              labelFor="client-secret"
              required
              requiredLabel
              inline
            >
              <InputGroup
                id="client-secret"
                onChange={handleClientSecretChange}
                value={clientSecret}
                className="bp3-fill"
              />
            </FormGroup>
            <FormGroup label="Client Permissions " inline>
              <ButtonGroup>
                <Dropdown
                  multi
                  alwaysShowSelectedCount
                  submitOnBlur
                  onSubmit={handlePermissionsChange}
                  selected={permissions}
                >
                  <Control />
                  {userPermissions.map((perm: string, index: number) => (
                    <Item key={index} title={perm} />
                  ))}
                </Dropdown>
                <Button big text="All" onClick={handleAllPermissionsClick} />
              </ButtonGroup>
            </FormGroup>
          </Flex>
        </Box>
      </Modal.Body>
      <Modal.Footer>
        <Pull right>
          <ButtonGroup>
            <Button icon="disable" big text="Cancel" onClick={onClose} />
            <Button
              icon="tick"
              big
              text="Save"
              type="submit"
              btnStyle="success"
            />
          </ButtonGroup>
        </Pull>
      </Modal.Footer>
    </Modal>
  </form>
);

export default compose(
  withState('clientId', 'changeClientId', ({ data }) => data?.clientId || ''),
  withState(
    'clientSecret',
    'changeClientSecret',
    ({ data }) => data?.clientSecret || ''
  ),
  withState(
    'permissions',
    'changePermissions',
    ({ data }) => data?.permissions || []
  ),
  withHandlers({
    handleClientIdChange: ({ changeClientId }): Function => (
      event: Object
    ): void => {
      const { value } = event.target;

      changeClientId(() => value);
    },
    handleClientSecretChange: ({ changeClientSecret }): Function => (
      event: Object
    ): void => {
      const { value } = event.target;

      changeClientSecret(() => value);
    },
    handlePermissionsChange: ({ changePermissions }): Function => (
      newPermissions: Array<string>
    ): void => {
      changePermissions(() => newPermissions);
    },
    handleFormSubmit: ({
      clientId,
      clientSecret,
      permissions,
      onSubmit,
    }): Function => (event: Object): void => {
      event.preventDefault();

      onSubmit(clientId, clientSecret, permissions);
    },
  }),
  withHandlers({
    handleAllPermissionsClick: ({
      userPermissions,
      handlePermissionsChange,
    }): Function => (): void => {
      handlePermissionsChange(userPermissions);
    },
  }),
  onlyUpdateForKeys(['clientId', 'clientSecret', 'permissions'])
)(AddClientModal);
