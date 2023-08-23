import { ReqoreTable, useReqoreProperty } from '@qoretechnologies/reqore';
import { IReqorePanelAction } from '@qoretechnologies/reqore/dist/components/Panel';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import withState from 'recompose/withState';
import { objectCollectionToArray } from '../../helpers/interfaces';
import titleManager from '../../hocomponents/TitleManager';
import pane from '../../hocomponents/pane';
import sync from '../../hocomponents/sync';
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
  const confirmAction = useReqoreProperty('confirmAction');
  const addNotification = useReqoreProperty('addNotification');
  const removeNotification = useReqoreProperty('removeNotification');

  const showSecret = (secret: string) => {
    addNotification({
      id: 'secret',
      title: 'Secret generated',
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
      opaque: true,
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

  const getActions = (data): IReqorePanelAction[] => [
    {
      icon: 'RefreshLine',
      tooltip: 'Regenerate secret',
      iconsAlign: 'center',
      onClick: async () => {
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
      },
    },
    {
      tooltip: 'Test access',
      icon: 'ShareBoxLine',
      iconsAlign: 'center',
      onClick: () => {
        const redirectUri = encodeURIComponent(`https://${window.location.host}/oauth2/code`);

        const url = `${settings.OAUTH_PUBLIC_URL}/token?response_type=code&client_id=${data.client_id}&redirect_uri=${redirectUri}`;

        window.location.href = url;
      },
    },
    {
      icon: 'Edit2Line',
      tooltip: 'Edit client',
      iconsAlign: 'center',
      onClick: () => {
        setClientData({
          clientId: data.client_id,
          clientDescription: data.client_description,
          clientSecret: data.client_secret,
          permissions: data.permissions,
        });
      },
    },
    {
      effect: {
        gradient: {
          direction: 'to right bottom',
          colors: { 0: '#a11c58', 140: '#480724' },
        },
      },
      tooltip: 'Delete client',
      iconsAlign: 'center',
      onClick: () => {
        const handleConfirm = (): void => {
          rest.optimisticDispatch(actions.clients.deleteClient, data.client_id, null);
        };

        confirmAction({
          onConfirm: () => handleConfirm(),
          intent: 'danger',
          description: `Are you sure you want to delete client "${data.client_id} - ${data.client_description}" permanently?`,
        });
      },
      icon: 'DeleteBin3Fill',
    },
  ];

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

      <>
        <ReqoreTable
          label="List of available OAuth2 clients"
          rounded
          flat
          actions={[
            {
              label: 'Add client',
              intent: 'info',
              icon: 'UserAddLine',
              onClick: () => setClientData({}),
            },
          ]}
          striped
          fill
          filterable
          exportable
          zoomable
          columns={[
            {
              dataId: 'client_id',
              header: {
                label: 'Client ID',
              },
              sortable: true,
              grow: 1,
              cell: {
                tooltip: ({ client_id }) => client_id,
              },
            },
            {
              dataId: 'client_description',
              header: {
                label: 'Client Description',
              },
              width: 200,
              grow: 2,
              sortable: true,
              cell: {
                tooltip: ({ client_description }) => client_description,
              },
            },
            {
              dataId: 'username',
              header: {
                label: 'User',
                icon: 'User3Fill',
              },
              width: 100,
              sortable: true,
              cell: {
                content: 'tag',
              },
            },
            {
              dataId: 'created',
              header: {
                label: 'Created',
                icon: 'TimeLine',
              },
              width: 100,
              sortable: true,
              cell: {
                content: 'time-ago',
              },
              align: 'center',
            },
            {
              dataId: 'modified',
              header: {
                label: 'Modified',
                icon: 'Timer2Line',
              },
              sortable: true,
              width: 100,
              cell: {
                content: 'time-ago',
              },
              align: 'center',
            },
            {
              dataId: 'actions',
              header: {
                label: 'Actions',
                icon: 'SettingsLine',
              },
              width: 160,
              align: 'right',
              pin: 'right',
              cell: {
                padded: 'none',
                actions: (data) => getActions(data),
              },
            },
          ]}
          onRowClick={(data) => openPane(data.client_id, undefined, { actions: getActions(data) })}
          data={clients}
          sort={{ by: 'created', direction: 'desc' }}
        />
      </>
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
