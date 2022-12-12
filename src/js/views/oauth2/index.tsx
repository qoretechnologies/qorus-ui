import {
  ReqoreButton,
  ReqoreColumn,
  ReqoreColumns,
  ReqoreContext,
  ReqoreControlGroup,
  ReqorePanel,
  ReqoreTable
} from '@qoretechnologies/reqore';
import { useContext } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import withState from 'recompose/withState';
import EnhancedTable from '../../components/EnhancedTable';
import Spacer from '../../components/Spacer';
import Search from '../../containers/search';
import { objectCollectionToArray } from '../../helpers/interfaces';
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
  optimisticDispatch: any;
  username: string;
  userPermissions: Array<string>;
  clientData: any;
  setClientData: any;
};

const ClientsView: Function = ({
  clients,
  openPane,
  username,
  userPermissions,
  clientData,
  setClientData,
  ...rest
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

  const onSubmit: Function = (
    clientId: string,
    clientDescription,
    clientSecret,
    permissions
  ): void => {
    rest.optimisticDispatch(
      // @ts-ignore ts-migrate(2339) FIXME: Property 'clients' does not exist on type '{}'.
      actions.clients.createClient,
      clientId,
      clientDescription,
      clientSecret,
      username,
      permissions,
      (data) => {
        setClientData(null);
        showSecret(data.inserted.client_secret);
      }
    );
  };

  const onSubmitUpdate: Function = (
    clientId: string,
    clientDescription,
    clientSecret,
    permissions
  ): void => {
    rest.optimisticDispatch(
      // @ts-ignore ts-migrate(2339) FIXME: Property 'clients' does not exist on type '{}'.
      actions.clients.updateClient,
      clientId,
      clientDescription,
      clientSecret,
      username,
      permissions,
      (data) => {
        setClientData(null);
      }
    );
  };

  return (
    <>
      {clientData && (
        <AddClientModal
          data={clientData}
          onClose={() => setClientData(null)}
          onSubmit={clientData.clientId ? onSubmitUpdate : onSubmit}
          userPermissions={userPermissions}
        />
      )}
      <ReqorePanel flat contentStyle={{ display: 'flex', flexFlow: 'column' }}>
        <EnhancedTable
          collection={clients}
          searchBy={['client_id', 'client_description', 'name', 'username']}
          tableId="clients"
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
                    <ReqoreButton onClick={() => setClientData({})} icon="UserAddLine">
                      Add Client
                    </ReqoreButton>

                    <ReqoreButton
                      intent="info"
                      icon="ShareBoxLine"
                      onClick={() => {
                        const redirectUri = encodeURIComponent(
                          `https://${window.location.host}/oauth2/code`
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
                  {
                    dataId: 'client_id',
                    header: 'Client ID',
                    sortable: true,
                    grow: 2,
                    cellTooltip: ({ client_id }) => client_id,
                  },
                  {
                    dataId: 'client_description',
                    header: 'Client Description',
                    sortable: true,
                    cellTooltip: ({ client_description }) => client_description,
                  },
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
                          flat={false}
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
                          flat={false}
                          onClick={(event) => {
                            event.stopPropagation();
                            setClientData({
                              clientId: data.client_id,
                              clientDescription: data.client_description,
                              clientSecret: data.client_secret,
                              permissions: data.permissions,
                            });
                          }}
                          icon="Edit2Line"
                        />
                        <ReqoreButton
                          effect={{
                            gradient: {
                              direction: 'to right bottom',
                              colors: { 0: '#a11c58', 140: '#480724' },
                            },
                          }}
                          flat={false}
                          onClick={(event) => {
                            event.stopPropagation();
                            const handleConfirm = (): void => {
                              rest.optimisticDispatch(
                                actions.clients.deleteClient,
                                data.client_id,
                                null
                              );
                            };

                            confirmAction({
                              onConfirm: () => handleConfirm(),
                              description: `Are you sure you want to delete client "${data.client_id}" permanently?`,
                            });
                          }}
                          icon="DeleteBin3Fill"
                          intent="danger"
                        />
                      </ReqoreControlGroup>
                    ),
                  },
                ]}
                onRowClick={(data) => openPane(data.client_id)}
                data={collection}
                sort={{ by: 'created', direction: 'desc' }}
              />
            </>
          )}
        </EnhancedTable>
      </ReqorePanel>
    </>
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
  withState('clientData', 'setClientData', null),
  mapProps(
    ({ clients, ...rest }: ClientsViewProps): ClientsViewProps => ({
      clients: objectCollectionToArray(clients),
      ...rest,
    })
  ),
  //@ts-ignore
  pane(ClientsPane, ['setClientData']),
  titleManager('OAuth2 Plugin'),
  withDispatch()
)(ClientsView);
