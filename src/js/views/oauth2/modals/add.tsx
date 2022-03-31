// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Modal from '../../../components/modal';
import {
  Controls as ButtonGroup,
  Control as Button,
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
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
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'onClose' does not exist on type 'AddClie... Remove this comment to see the full error message
  onClose,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'handleFormSubmit' does not exist on type... Remove this comment to see the full error message
  handleFormSubmit,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'handleClientIdChange' does not exist on ... Remove this comment to see the full error message
  handleClientIdChange,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'handleClientSecretChange' does not exist... Remove this comment to see the full error message
  handleClientSecretChange,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'handlePermissionsChange' does not exist ... Remove this comment to see the full error message
  handlePermissionsChange,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'clientId' does not exist on type 'AddCli... Remove this comment to see the full error message
  clientId,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'clientSecret' does not exist on type 'Ad... Remove this comment to see the full error message
  clientSecret,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'permissions' does not exist on type 'Add... Remove this comment to see the full error message
  permissions,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'userPermissions' does not exist on type ... Remove this comment to see the full error message
  userPermissions,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'handleAllPermissionsClick' does not exis... Remove this comment to see the full error message
  handleAllPermissionsClick,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'AddClientM... Remove this comment to see the full error message
  data,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
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
              // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; label: string; labelFor... Remove this comment to see the full error message
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
              // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; label: string; labelFor... Remove this comment to see the full error message
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
                  // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                  submitOnBlur
                  onSubmit={handlePermissionsChange}
                  selected={permissions}
                >
                  { /* @ts-expect-error ts-migrate(2739) FIXME: Type '{}' is missing the following properties from... Remove this comment to see the full error message */ }
                  <Control />
                  {userPermissions.map((perm: string, index: number) => (
                    // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'target' does not exist on type 'Object'.
      const { value } = event.target;

      changeClientId(() => value);
    },
    handleClientSecretChange: ({ changeClientSecret }): Function => (
      event: Object
    ): void => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'target' does not exist on type 'Object'.
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'preventDefault' does not exist on type '... Remove this comment to see the full error message
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
