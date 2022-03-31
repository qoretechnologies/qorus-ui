// @flow
import size from 'lodash/size';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { ActionColumn, ActionColumnHeader } from '../../components/ActionColumn';
import { AuthorColumn, AuthorColumnHeader } from '../../components/AuthorColumn';
import Box from '../../components/box';
import ConfirmDialog from '../../components/confirm_dialog';
import { Control as Button, Controls as ButtonGroup } from '../../components/controls';
import DataOrEmptyTable from '../../components/DataOrEmptyTable';
import EnhancedTable from '../../components/EnhancedTable';
import Flex from '../../components/Flex';
import LoadMore from '../../components/LoadMore';
import NameColumn, { NameColumnHeader } from '../../components/NameColumn';
import { FixedRow, Table, Tbody, Td, Th, Thead, Tr } from '../../components/new_table';
import Pull from '../../components/Pull';
import { sortDefaults } from '../../constants/sort';
import Search from '../../containers/search';
import { objectCollectionToArray } from '../../helpers/interfaces';
import modal from '../../hocomponents/modal';
import pane from '../../hocomponents/pane';
import sync from '../../hocomponents/sync';
import titleManager from '../../hocomponents/TitleManager';
import withDispatch from '../../hocomponents/withDispatch';
import actions from '../../store/api/actions';
import Header from './header';
import AddClientModal from './modals/add';
import ClientsPane from './pane';

type ClientsViewProps = {
  clients: any | Array<Object>;
  handleAddClientClick: Function;
  handleUpdateClientClick: Function;
  handleDeleteClientClick: Function;
  openPane: Function;
  paneId: string;
};

const ClientsView: Function = ({
  clients,
  handleAddClientClick,
  handleUpdateClientClick,
  handleDeleteClientClick,
  openPane,
  paneId,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
ClientsViewProps) => (
  <Flex>
    <Header />
    <Box top noPadding>
      <EnhancedTable
        collection={clients}
        searchBy={['client_id', 'name', 'username']}
        tableId="clients"
        // @ts-ignore ts-migrate(2339) FIXME: Property 'clients' does not exist on type '{ order... Remove this comment to see the full error message
        sortDefault={sortDefaults.clients}
      >
        {({
          sortData,
          onSortChange,
          handleSearchChange,
          handleLoadMore,
          handleLoadAll,
          canLoadMore,
          limit,
          collection,
        }) => (
          <Table fixed striped condensed>
            <Thead>
              <FixedRow className="toolbar-row">
                <Th>
                  <Pull>
                    <ButtonGroup>
                      <Button
                        big
                        onClick={handleAddClientClick}
                        title="Add Client"
                        text="Add Client"
                        icon="plus"
                      />
                    </ButtonGroup>
                  </Pull>
                  <Pull right>
                    <LoadMore
                      canLoadMore={canLoadMore}
                      onLoadMore={handleLoadMore}
                      onLoadAll={handleLoadAll}
                      limit={limit}
                    />
                    <Search onSearchUpdate={handleSearchChange} resource="clients" />
                  </Pull>
                </Th>
              </FixedRow>
              <FixedRow {...{ onSortChange, sortData }}>
                <NameColumnHeader name="client_id" title="Client" />
                <ActionColumnHeader />
                <Th className="text" icon="key">
                  Secret
                </Th>
                <AuthorColumnHeader name="username">Parent</AuthorColumnHeader>
              </FixedRow>
            </Thead>
            <DataOrEmptyTable condition={size(collection) === 0} cols={4}>
              {(props) => (
                <Tbody {...props}>
                  {collection.map(
                    // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                    (client: any, index: number) => (
                      <Tr
                        key={index}
                        first={index === 0}
                        // @ts-ignore ts-migrate(2339) FIXME: Property 'client_id' does not exist on type 'Objec... Remove this comment to see the full error message
                        active={paneId === client.client_id}
                      >
                        <NameColumn
                          // @ts-ignore ts-migrate(2339) FIXME: Property 'client_id' does not exist on type 'Objec... Remove this comment to see the full error message
                          name={client.client_id}
                          onDetailClick={() => {
                            // @ts-ignore ts-migrate(2339) FIXME: Property 'client_id' does not exist on type 'Objec... Remove this comment to see the full error message
                            openPane(client.client_id);
                          }}
                          // @ts-ignore ts-migrate(2339) FIXME: Property 'client_id' does not exist on type 'Objec... Remove this comment to see the full error message
                          isActive={paneId === client.client_id}
                        />
                        <ActionColumn>
                          <ButtonGroup>
                            <Button
                              icon="edit"
                              title="Edit client"
                              onClick={() => {
                                handleUpdateClientClick(
                                  // @ts-ignore ts-migrate(2339) FIXME: Property 'client_id' does not exist on type 'Objec... Remove this comment to see the full error message
                                  client.client_id,
                                  // @ts-ignore ts-migrate(2339) FIXME: Property 'client_secret' does not exist on type 'O... Remove this comment to see the full error message
                                  client.client_secret,
                                  // @ts-ignore ts-migrate(2339) FIXME: Property 'permissions' does not exist on type 'Obj... Remove this comment to see the full error message
                                  client.permissions
                                );
                              }}
                            />
                            <Button
                              icon="remove"
                              title="Delete client"
                              btnStyle="danger"
                              onClick={() => {
                                // @ts-ignore ts-migrate(2339) FIXME: Property 'client_id' does not exist on type 'Objec... Remove this comment to see the full error message
                                handleDeleteClientClick(client.client_id);
                              }}
                            />
                          </ButtonGroup>
                        </ActionColumn>
                        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'client_secret' does not exist on type 'O... Remove this comment to see the full error message */}
                        <Td className="text">{client.client_secret}</Td>
                        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'username' does not exist on type 'Object... Remove this comment to see the full error message */}
                        <AuthorColumn>{client.username}</AuthorColumn>
                      </Tr>
                    )
                  )}
                </Tbody>
              )}
            </DataOrEmptyTable>
          </Table>
        )}
      </EnhancedTable>
    </Box>
  </Flex>
);

export default compose(
  connect(
    (state: any): any => ({
      // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      meta: state.api.clients,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      clients: state.api.clients.data,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      username: state.api.currentUser.data.username,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      userPermissions: state.api.currentUser.data.permissions,
    }),
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'clients' does not exist on type '{}'.
      load: actions.clients.fetch,
    }
  ),
  sync('meta'),
  mapProps(
    ({ clients, ...rest }: ClientsViewProps): ClientsViewProps => ({
      clients: objectCollectionToArray(clients),
      ...rest,
    })
  ),
  modal(),
  withDispatch(),
  withHandlers({
    handleAddClientClick:
      ({ openModal, closeModal, username, userPermissions, optimisticDispatch }): Function =>
      (): void => {
        const onSubmit: Function = (clientId, clientSecret, permissions): void => {
          optimisticDispatch(
            // @ts-ignore ts-migrate(2339) FIXME: Property 'clients' does not exist on type '{}'.
            actions.clients.createClient,
            clientId,
            clientSecret,
            username,
            permissions,
            () => {
              closeModal();
            }
          );
        };

        openModal(
          <AddClientModal
            onClose={closeModal}
            userPermissions={userPermissions}
            onSubmit={onSubmit}
          />
        );
      },
    handleUpdateClientClick:
      ({ openModal, closeModal, username, userPermissions, optimisticDispatch }): Function =>
      (clientId, clientSecret, permissions): void => {
        const onSubmit: Function = (newClientId, newClientSecret, newPermissions): void => {
          optimisticDispatch(
            // @ts-ignore ts-migrate(2339) FIXME: Property 'clients' does not exist on type '{}'.
            actions.clients.updateClient,
            newClientId,
            newClientSecret,
            username,
            newPermissions,
            () => {
              closeModal();
            }
          );
        };

        openModal(
          <AddClientModal
            onClose={closeModal}
            userPermissions={userPermissions}
            data={{
              clientId,
              clientSecret,
              permissions,
            }}
            onSubmit={onSubmit}
          />
        );
      },
    handleDeleteClientClick:
      ({ openModal, closeModal, optimisticDispatch }): Function =>
      (clientId): void => {
        const handleConfirm: Function = (): void => {
          // @ts-ignore ts-migrate(2339) FIXME: Property 'clients' does not exist on type '{}'.
          optimisticDispatch(actions.clients.deleteClient, clientId, () => {
            closeModal();
          });
        };

        openModal(
          <ConfirmDialog onClose={closeModal} onConfirm={handleConfirm}>
            Are you sure you want to delete this client?
          </ConfirmDialog>
        );
      },
  }),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
  pane(ClientsPane, ['handleUpdateClientClick']),
  titleManager('OAuth2 Plugin'),
  onlyUpdateForKeys(['clients', 'paneId'])
)(ClientsView);
