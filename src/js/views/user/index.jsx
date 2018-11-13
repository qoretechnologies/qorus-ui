import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import capitalize from 'lodash/capitalize';

import { Breadcrumbs, Crumb, CrumbTabs } from '../../components/breadcrumbs';
import Box from '../../components/box';
import { Button, Intent, Tag } from '@blueprintjs/core';
import actions from '../../store/api/actions';
import Headbar from '../../components/Headbar';
import { SimpleTabs, SimpleTab } from '../../components/SimpleTabs';
import PaneItem from '../../components/pane_item';
import NoData from '../../components/nodata';
import Tree from '../../components/tree';
import Container from '../../components/container';
import Alert from '../../components/alert';
import { normalizeName } from '../../components/utils';
import Pull from '../../components/Pull';
import withTabs from '../../hocomponents/withTabs';
import UserSettings from './tabs/settings';

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

const interfaceIds = {
  workflows: 'workflowid',
  services: 'serviceid',
  jobs: 'jobid',
  vmaps: 'id',
  mappers: 'mapperid',
};

const UserView: Function = ({
  userData,
  clearStorage,
  tabQuery,
}: {
  userData: Object,
  clearStorage: Function,
  tabQuery: string,
}) => (
  <div>
    <Headbar>
      <Breadcrumbs>
        <Crumb>
          {userData.name} <small>({userData.provider})</small>
        </Crumb>
        <CrumbTabs tabs={['Overview', 'Settings']} />
      </Breadcrumbs>
      <Pull right>
        <Button
          intent={Intent.DANGER}
          iconName="cross"
          text="Clear storage"
          onClick={clearStorage}
        />
      </Pull>
    </Headbar>
    <Box top>
      <Container>
        <SimpleTabs activeTab={tabQuery}>
          <SimpleTab name="overview">
            {interfaces.map((intrf: string) => (
              <PaneItem title={capitalize(intrf)}>
                {userData[intrf].length ? (
                  userData[intrf]
                    .map((datum: string | Object) => {
                      if (typeof datum === 'string') {
                        return datum;
                      }

                      return normalizeName(datum, interfaceIds[intrf]);
                    })
                    .map(
                      (datum: string): React.Element<Tag> => (
                        <span>
                          <Tag className="tag-with-margin">{datum}</Tag>{' '}
                        </span>
                      )
                    )
                ) : userData.has_default ? (
                  <Alert bsStyle="warning" iconName="info-sign">
                    {' '}
                    Member of DEFAULT group with no restrictions; all interfaces
                    are accessible
                  </Alert>
                ) : (
                  <NoData />
                )}
              </PaneItem>
            ))}
            <PaneItem title="Storage data">
              <Tree data={userData.storage} />
            </PaneItem>
          </SimpleTab>
          <SimpleTab name="settings">
            <UserSettings {...userData.storage.settings} />
          </SimpleTab>
        </SimpleTabs>
      </Container>
    </Box>
  </div>
);

export default compose(
  connect(
    (state: Object) => ({
      storage: state.api.currentUser.data.storage,
      userData: state.api.currentUser.data,
    }),
    {
      clearStorage: actions.currentUser.clearStorage,
    }
  ),
  withTabs('overview'),
  onlyUpdateForKeys(['userData', 'storage', 'tabQuery'])
)(UserView);
