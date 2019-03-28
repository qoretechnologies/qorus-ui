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
                  client.client_id,
                  client.client_secret,
                  client.permissions
                );
              }}
            />
          </ButtonGroup>
        }
      >
        <NoDataIf condition={!size(client.permissions)}>
          {() =>
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
    state.api.clients.data
  );

  return clients.find((client: Object) => client.client_id === props.paneId);
};

const selector = createSelector(
  [clientSelector],
  client => ({ client })
);

export default compose(
  connect(selector),
  onlyUpdateForKeys(['client', 'paneId'])
)(ClientPane);
