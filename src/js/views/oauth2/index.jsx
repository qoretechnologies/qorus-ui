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
} from '../../components/controls';
import modal from '../../hocomponents/modal';
import withHandlers from 'recompose/withHandlers';
import withDispatch from '../../hocomponents/withDispatch';
import AddClientModal from './modals/add';
import Header from './header';

type ClientsViewProps = {
  clients: Object | Array<Object>,
};

const ClientsView: Function = ({
  clients,
  handleAddClientClick,
  handleUpdateClientClick,
  handleDeleteClientClick,
}: ClientsViewProps): React.Element<any> => (
  <Flex>
    <Header />
    <Box top noPadding>
      <EnhancedTable
        collection={clients}
        searchBy={['client_id', 'name', 'username']}
        tableId="clients"
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
                <Th className="text" icon="cog">
                  Permissions
                </Th>
              </FixedRow>
            </Thead>
            <DataOrEmptyTable condition={size(collection) === 0} cols={4}>
              {props => (
                <Tbody {...props}>
                  {collection.map(
                    (client: Object, index: number): React.Element<Tr> => (
                      <Tr key={index} first={index === 0}>
                        <NameColumn name={client.client_id} />
                        <ActionColumn>
                          <ButtonGroup>
                            <Button
                              icon="edit"
                              title="Edit client"
                              onClick={() => {
                                handleUpdateClientClick(
                                  client.client_id,
                                  client.client_secret,
                                  client.permissions
                                );
                              }}
                            />
                            <Button
                              icon="remove"
                              title="Delete client"
                              btnStyle="danger"
                              onClick={() => {
                                handleDeleteClientClick(client.client_id);
                              }}
                            />
                          </ButtonGroup>
                        </ActionColumn>
                        <Td className="text">{client.client_secret}</Td>
                        <AuthorColumn>{client.username}</AuthorColumn>
                        <Td className="text">
                          {size(client.permissions) &&
                            client.permissions.map(
                              (permission: string, index: number): string =>
                                `${
                                  index === 0 ? permission : `, ${permission}`
                                }`
                            )}
                        </Td>
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
      meta: state.api.clients,
      clients: state.api.clients.data,
      username: state.api.currentUser.data.username,
      userPermissions: state.api.currentUser.data.permissions,
    }),
    {
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
  titleManager('OAuth2 Plugin'),
  onlyUpdateForKeys(['clients'])
)(ClientsView);
