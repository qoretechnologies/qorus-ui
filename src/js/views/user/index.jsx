import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import capitalize from 'lodash/capitalize';

import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';
import Box from '../../components/box';
import { Button, Intent, Tag } from '@blueprintjs/core';
import actions from '../../store/api/actions';
import Toolbar from '../../components/toolbar';
import PaneItem from '../../components/pane_item';
import NoData from '../../components/nodata';
import Tree from '../../components/tree';
import Container from '../../components/container';
import Alert from '../../components/alert';

const interfaces: Array<string> = [
  'roles',
  'permissions',
  'workflows',
  'services',
  'jobs',
  'groups',
  'vmaps',
  'mappers',
];

const UserView: Function = ({
  userData,
  clearStorage,
}: {
  userData: Object,
  clearStorage: Function,
}) => (
  <div>
    <Toolbar mb>
      <Breadcrumbs>
        <Crumb>My profile</Crumb>
      </Breadcrumbs>
      <Button
        className="pull-right"
        intent={Intent.DANGER}
        text="Clear storage"
        onClick={clearStorage}
      />
    </Toolbar>
    <Box>
      <h3 className="heading">
        {userData.name} <small>({userData.provider})</small>
      </h3>
      <Container>
        {interfaces.map((intrf: string) => (
          <PaneItem title={capitalize(intrf)}>
            {userData[intrf].length ? (
              userData[intrf].map(
                (datum: string): React.Element<Tag> => (
                  <span>
                    <Tag className="tag-with-margin">{datum}</Tag>{' '}
                  </span>
                )
              )
            ) : userData.has_default ? (
              <Alert bsStyle="warning" iconName="info-sign">
                {' '}
                Member of DEFAULT group with no restrictions; all interfaces are
                accessible
              </Alert>
            ) : (
              <NoData />
            )}
          </PaneItem>
        ))}
        <PaneItem title="Storage data">
          <Tree data={userData.storage} />
        </PaneItem>
      </Container>
    </Box>
  </div>
);

export default compose(
  connect(
    (state: Object) => ({
      userData: state.api.currentUser.data,
    }),
    {
      clearStorage: actions.currentUser.clearStorage,
    }
  ),
  onlyUpdateForKeys(['userData'])
)(UserView);
