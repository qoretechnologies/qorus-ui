import {
  ReqoreButton,
  ReqoreColumn,
  ReqoreColumns,
  ReqoreContext,
  ReqoreControlGroup,
  ReqorePanel,
  ReqoreTable,
} from '@qoretechnologies/reqore';
import { useContext } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import EnhancedTable from '../../components/EnhancedTable';
import Spacer from '../../components/Spacer';
import { sortDefaults } from '../../constants/sort';
import Search from '../../containers/search';
import { objectCollectionToArray } from '../../helpers/interfaces';
import modal from '../../hocomponents/modal';
import pane from '../../hocomponents/pane';
import sync from '../../hocomponents/sync';
import titleManager from '../../hocomponents/TitleManager';
import withDispatch from '../../hocomponents/withDispatch';
import settings from '../../settings';
import actions from '../../store/api/actions';
import { post } from '../../store/api/utils';
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
ClientsViewProps) => {
  const { confirmAction, addNotification, removeNotification } = useContext(ReqoreContext);

  const showSecret = (secret: string) => {
    addNotification({
      id: 'secret',
      content: `Please copy this secret and save it somewhere safe. You will not be able to see it again. ${secret}. Clicking on this notification will copy the secret to your clipboard.`,
      duration: 50000,
      onClick: () => {
        navigator.clipboard.writeText(secret);
        addNotification({
          id: 'secret',
          content: 'Successfully copied to clipboard',
          duration: 2000,
          flat: true,
          onFinish(id?) {
            removeNotification(id);
          },
          intent: 'success',
        });
      },
      intent: 'info',
      flat: true,
    });
  };

  return (
    <ReqorePanel flat contentStyle={{ display: 'flex', flexFlow: 'column' }}>
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
          <>
            <ReqoreColumns>
              <ReqoreColumn>
                <ReqoreControlGroup>
                  <ReqoreButton onClick={() => handleAddClientClick(showSecret)} icon="UserAddLine">
                    Add Client
                  </ReqoreButton>

                  <ReqoreButton
                    intent="info"
                    icon="ShareBoxLine"
                    onClick={() => {
                      const redirectUri = encodeURIComponent(
                        `https://${window.location.host}/plugins/oauth2/code`
                      );

                      const url = `${settings.OAUTH_PUBLIC_URL}/token?response_type=code&client_id=uitest&username=admin&password=admin&redirect_uri=${redirectUri}`;

                      window.location.href = url;
                    }}
                  >
                    Test Qorus Access
                  </ReqoreButton>
                </ReqoreControlGroup>
              </ReqoreColumn>
              <ReqoreColumn justifyContent="flex-end">
                <Search onSearchUpdate={handleSearchChange} resource="clients" />
              </ReqoreColumn>
            </ReqoreColumns>

            <Spacer size={15} />
            <ReqoreTable
              rounded
              flat
              striped
              fill
              columns={[
                { dataId: 'client_id', header: 'Client ID', sortable: true, content: 'title' },
                {
                  dataId: 'username',
                  header: 'User',
                  icon: 'User3Fill',
                  sortable: true,
                  content: 'tag',
                },
                {
                  dataId: 'created',
                  header: 'Created',
                  icon: 'TimeLine',
                  sortable: true,
                  content: 'time-ago',
                  align: 'center',
                },
                {
                  dataId: 'modified',
                  header: 'Modified',
                  icon: 'TimeLine',
                  sortable: true,
                  content: 'time-ago',
                  align: 'center',
                },
                {
                  dataId: 'actions',
                  header: 'Actions',
                  icon: 'SettingsLine',
                  width: 380,
                  align: 'right',
                  content: (data) => (
                    <ReqoreControlGroup stack>
                      <ReqoreButton
                        onClick={async (event) => {
                          event.stopPropagation();

                          addNotification({
                            id: 'secret',
                            intent: 'pending',
                            flat: true,
                            title: 'Generating new secret...',
                            content: 'Please wait...',
                          });

                          const newSecret = await post(
                            `${settings.OAUTH_URL}/clients/${data.client_id}/generateSecret`
                          );

                          if (!newSecret.err) {
                            showSecret(newSecret.client_secret);
                          }
                        }}
                        icon="RefreshLine"
                      >
                        Regenerate Secret
                      </ReqoreButton>
                      <ReqoreButton
                        onClick={(event) => {
                          event.stopPropagation();
                          handleUpdateClientClick(
                            data.client_id,
                            data.client_secret,
                            data.permissions
                          );
                        }}
                        icon="Edit2Line"
                      >
                        Edit
                      </ReqoreButton>
                      <ReqoreButton
                        onClick={(event) => {
                          event.stopPropagation();
                          const handleConfirm = (): void => {
                            // @ts-ignore ts-migrate(2339) FIXME: Property 'clients' does not exist on type '{}'.
                            optimisticDispatch(actions.clients.deleteClient, clientId);
                          };

                          confirmAction({
                            onConfirm: handleConfirm,
                          });
                        }}
                        icon="DeleteBin3Fill"
                        intent="danger"
                      >
                        Delete
                      </ReqoreButton>
                    </ReqoreControlGroup>
                  ),
                },
              ]}
              onRowClick={(data) => openPane(data.client_id)}
              data={collection}
            />
          </>
        )}
      </EnhancedTable>
    </ReqorePanel>
  );
};

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
      (onSuccess: (secret: string) => void): void => {
        const onSubmit: Function = (clientId, clientSecret, permissions): void => {
          optimisticDispatch(
            // @ts-ignore ts-migrate(2339) FIXME: Property 'clients' does not exist on type '{}'.
            actions.clients.createClient,
            clientId,
            clientSecret,
            username,
            permissions,
            (data) => {
              closeModal();
              onSuccess(data.inserted.client_secret);
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
  }),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
  pane(ClientsPane, ['handleUpdateClientClick']),
  titleManager('OAuth2 Plugin'),
  onlyUpdateForKeys(['clients', 'paneId'])
)(ClientsView);
