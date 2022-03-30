import Pane from '../../components/pane';

// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Box from '../../components/box';
import PaneItem from '../../components/pane_item';
import size from 'lodash/size';
import NoDataIf from '../../components/NoDataIf';
import { Tag } from '@blueprintjs/core';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { objectCollectionToArray } from '../../helpers/interfaces';
import {
  Controls as ButtonGroup,
  Control as Button,
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
} from '../../components/controls';

type ClientPaneProps = {
  paneId: string,
  onClose: Function,
  handleUpdateClientClick: Function,
  client: Object,
};

const ClientPane: Function = ({
  paneId,
  onClose,
  client,
  handleUpdateClientClick,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: ClientPaneProps): React.Element<any> => (
  <Pane title={paneId} onClose={onClose} width={600}>
    <Box fill top>
      <PaneItem
        title="Permissions"
        label={
          <ButtonGroup>
            <Button
              label="Edit"
              icon="edit"
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
          </ButtonGroup>
        }
      >
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'permissions' does not exist on type 'Obj... Remove this comment to see the full error message
        <NoDataIf condition={!size(client.permissions)}>
          {() =>
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'permissions' does not exist on type 'Obj... Remove this comment to see the full error message
            client.permissions.map((permission: string) => (
              <span>
                <Tag className="tag-with-margin">{permission}</Tag>{' '}
              </span>
            ))
          }
        </NoDataIf>
      </PaneItem>
    </Box>
  </Pane>
);

const clientSelector: Function = (state: Object, props: Object): Object => {
  const clients: Array<Object> = objectCollectionToArray(
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
    state.api.clients.data
  );

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'client_id' does not exist on type 'Objec... Remove this comment to see the full error message
  return clients.find((client: Object) => client.client_id === props.paneId);
};

// @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
const selector = createSelector(
  [clientSelector],
  client => ({ client })
);

export default compose(
  connect(selector),
  onlyUpdateForKeys(['client', 'paneId'])
)(ClientPane);
