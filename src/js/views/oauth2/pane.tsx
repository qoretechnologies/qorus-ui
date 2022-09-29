import { ReqorePanel, ReqoreTag, ReqoreTagGroup } from '@qoretechnologies/reqore';
import size from 'lodash/size';
// @flow
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { createSelector } from 'reselect';
import NoDataIf from '../../components/NoDataIf';
import Pane from '../../components/pane';
import { objectCollectionToArray } from '../../helpers/interfaces';

type ClientPaneProps = {
  paneId: string;
  onClose: Function;
  handleUpdateClientClick: Function;
  client: any;
};

const ClientPane: Function = ({
  paneId,
  onClose,
  client,
  handleUpdateClientClick,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
ClientPaneProps) => (
  <Pane title={paneId} onClose={onClose} width={600}>
    <ReqorePanel
      flat
      label="Permissions"
      actions={[
        {
          label: 'Edit',
          icon: 'Edit2Line',
          onClick: () => {
            handleUpdateClientClick(
              // @ts-ignore ts-migrate(2339) FIXME: Property 'client_id' does not exist on type 'Objec... Remove this comment to see the full error message
              client.client_id,
              // @ts-ignore ts-migrate(2339) FIXME: Property 'client_secret' does not exist on type 'O... Remove this comment to see the full error message
              client.client_secret,
              // @ts-ignore ts-migrate(2339) FIXME: Property 'permissions' does not exist on type 'Obj... Remove this comment to see the full error message
              client.permissions
            );
          },
        },
      ]}
    >
      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'permissions' does not exist on type 'Obj... Remove this comment to see the full error message */}
      <NoDataIf condition={!size(client.permissions)}>
        {() => (
          <ReqoreTagGroup>
            {client.permissions.map((permission: string) => (
              <ReqoreTag label={permission} />
            ))}
          </ReqoreTagGroup>
        )}
      </NoDataIf>
    </ReqorePanel>
  </Pane>
);

const clientSelector: Function = (state: any, props: any): any => {
  const clients: Array<Object> = objectCollectionToArray(
    // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
    state.api.clients.data
  );

  // @ts-ignore ts-migrate(2339) FIXME: Property 'client_id' does not exist on type 'Objec... Remove this comment to see the full error message
  return clients.find((client: any) => client.client_id === props.paneId);
};

// @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
const selector = createSelector([clientSelector], (client) => ({ client }));

export default compose(connect(selector), onlyUpdateForKeys(['client', 'paneId']))(ClientPane);
