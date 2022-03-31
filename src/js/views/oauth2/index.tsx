// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Flex from '../../components/Flex';
import { connect } from 'react-redux';
import actions from '../../store/api/actions';
import sync from '../../hocomponents/sync';
import titleManager from '../../hocomponents/TitleManager';
import mapProps from 'recompose/mapProps';
import { objectCollectionToArray } from '../../helpers/interfaces';
import EnhancedTable from '../../components/EnhancedTable';
import { sortDefaults } from '../../constants/sort';
import { Table } from '../../components/new_table';
import { Thead } from '../../components/new_table';
import { FixedRow } from '../../components/new_table';
import { NameColumnHeader } from '../../components/NameColumn';
import { AuthorColumnHeader } from '../../components/AuthorColumn';
import { Th } from '../../components/new_table';
import Pull from '../../components/Pull';
import LoadMore from '../../components/LoadMore';
import ConfirmDialog from '../../components/confirm_dialog';
import Box from '../../components/box';
import Search from '../../containers/search';
import DataOrEmptyTable from '../../components/DataOrEmptyTable';
import { Tbody } from '../../components/new_table';
import NameColumn from '../../components/NameColumn';
import { AuthorColumn } from '../../components/AuthorColumn';
import {
  ActionColumnHeader,
  ActionColumn,
} from '../../components/ActionColumn';
import { Tr } from '../../components/new_table';
import { Td } from '../../components/new_table';
import size from 'lodash/size';
import {
  Controls as ButtonGroup,
  Control as Button,
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
} from '../../components/controls';
import modal from '../../hocomponents/modal';
import withHandlers from 'recompose/withHandlers';
import withDispatch from '../../hocomponents/withDispatch';
import AddClientModal from './modals/add';
import Header from './header';
import pane from '../../hocomponents/pane';
import ClientsPane from './pane';

type ClientsViewProps = {
  clients: Object | Array<Object>,
  handleAddClientClick: Function,
  handleUpdateClientClick: Function,
  handleDeleteClientClick: Function,
  openPane: Function,
  paneId: string,
};

const ClientsView: Function = ({
  clients,
  handleAddClientClick,
  handleUpdateClientClick,
  handleDeleteClientClick,
  openPane,
  paneId,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: ClientsViewProps): React.Element<any> => (
  <Flex>
    <Header />
    <Box top noPadding>
      <EnhancedTable
        collection={clients}
        searchBy={['client_id', 'name', 'username']}
        tableId="clients"
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'clients' does not exist on type '{ order... Remove this comment to see the full error message
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
                    <Search
                      onSearchUpdate={handleSearchChange}
                      resource="clients"
                    />
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
              {props => (
                <Tbody {...props}>
                  {collection.map(
                    // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                    (client: Object, index: number): React.Element<Tr> => (
                      <Tr
                        key={index}
                        first={index === 0}
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'client_id' does not exist on type 'Objec... Remove this comment to see the full error message
                        active={paneId === client.client_id}
                      >
                        <NameColumn
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'client_id' does not exist on type 'Objec... Remove this comment to see the full error message
                          name={client.client_id}
                          onDetailClick={() => {
                            // @ts-expect-error ts-migrate(2339) FIXME: Property 'client_id' does not exist on type 'Objec... Remove this comment to see the full error message
                            openPane(client.client_id);
                          }}
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'client_id' does not exist on type 'Objec... Remove this comment to see the full error message
                          isActive={paneId === client.client_id}
                        />
                        <ActionColumn>
                          <ButtonGroup>
                            <Button
                              icon="edit"
                              title="Edit client"
                              onClick={() => {
                                handleUpdateClientClick(
                                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'client_id' does not exist on type 'Objec... Remove this comment to see the full error message
                                  client.client_id,
                                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'client_secret' does not exist on type 'O... Remove this comment to see the full error message
                                  client.client_secret,
                                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'permissions' does not exist on type 'Obj... Remove this comment to see the full error message
                                  client.permissions
                                );
                              }}
                            />
                            <Button
                              icon="remove"
                              title="Delete client"
                              btnStyle="danger"
                              onClick={() => {
                                // @ts-expect-error ts-migrate(2339) FIXME: Property 'client_id' does not exist on type 'Objec... Remove this comment to see the full error message
                                handleDeleteClientClick(client.client_id);
                              }}
                            />
                          </ButtonGroup>
                        </ActionColumn>
                        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'client_secret' does not exist on type 'O... Remove this comment to see the full error message */ }
                        <Td className="text">{client.client_secret}</Td>
                        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'username' does not exist on type 'Object... Remove this comment to see the full error message */ }
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
    (state: Object): Object => ({
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      meta: state.api.clients,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      clients: state.api.clients.data,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      username: state.api.currentUser.data.username,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      userPermissions: state.api.currentUser.data.permissions,
    }),
    {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'clients' does not exist on type '{}'.
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
    handleAddClientClick: ({
      openModal,
      closeModal,
      username,
      userPermissions,
      optimisticDispatch,
    }): Function => (): void => {
      const onSubmit: Function = (
        clientId,
        clientSecret,
        permissions
      ): void => {
        optimisticDispatch(
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'clients' does not exist on type '{}'.
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
    handleUpdateClientClick: ({
      openModal,
      closeModal,
      username,
      userPermissions,
      optimisticDispatch,
    }): Function => (clientId, clientSecret, permissions): void => {
      const onSubmit: Function = (
        newClientId,
        newClientSecret,
        newPermissions
      ): void => {
        optimisticDispatch(
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'clients' does not exist on type '{}'.
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
    handleDeleteClientClick: ({
      openModal,
      closeModal,
      optimisticDispatch,
    }): Function => (clientId): void => {
      const handleConfirm: Function = (): void => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'clients' does not exist on type '{}'.
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
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
  pane(ClientsPane, ['handleUpdateClientClick']),
  titleManager('OAuth2 Plugin'),
  onlyUpdateForKeys(['clients', 'paneId'])
)(ClientsView);
