import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import capitalize from 'lodash/capitalize';

import { Breadcrumbs, Crumb, CrumbTabs } from '../../components/breadcrumbs';
import Box from '../../components/box';
import { Button, Intent, Tag, ButtonGroup } from '@blueprintjs/core';
import actions from '../../store/api/actions';
import Headbar from '../../components/Headbar';
import { SimpleTabs, SimpleTab } from '../../components/SimpleTabs';
import PaneItem from '../../components/pane_item';
import NoData from '../../components/nodata';
import Tree from '../../components/tree';
import Alert from '../../components/alert';
import { normalizeName } from '../../components/utils';
import Pull from '../../components/Pull';
import withTabs from '../../hocomponents/withTabs';
import UserSettings from './tabs/settings';
import Flex from '../../components/Flex';
import { INTERFACE_IDS } from '../../constants/interfaces';
import { injectIntl, FormattedMessage } from 'react-intl';
import withHandlers from 'recompose/withHandlers';
import modal from '../../hocomponents/modal';
import withDispatch from '../../hocomponents/withDispatch';
import ResetModal from '../../views/system/rbac/users/modal';

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
  tabQuery,
  intl,
  onPasswordResetClick,
}: {
  userData: Object,
  clearStorage: Function,
  tabQuery: string,
}) => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb>
          {userData.name} <small>({userData.provider})</small>
        </Crumb>
        <CrumbTabs tabs={['Overview', 'Settings']} />
      </Breadcrumbs>
      <Pull right>
        <ButtonGroup>
          <Button
            icon="lock"
            text={intl.formatMessage({ id: 'user.reset-password' })}
            onClick={onPasswordResetClick}
          />
          <Button
            intent={Intent.DANGER}
            icon="cross"
            text={intl.formatMessage({ id: 'user.clear-storage' })}
            onClick={clearStorage}
          />
        </ButtonGroup>
      </Pull>
    </Headbar>

    <SimpleTabs activeTab={tabQuery}>
      <SimpleTab name="overview">
        <Box fill top scrollY>
          {interfaces.map((intrf: string) => (
            <PaneItem title={intl.formatMessage({ id: 'global.' + intrf })}>
              {userData[intrf].length ? (
                userData[intrf]
                  .map((datum: string | Object) => {
                    if (typeof datum === 'string') {
                      return datum;
                    }

                    return normalizeName(datum, INTERFACE_IDS[intrf]);
                  })
                  .map((datum: string): React.Element<Tag> => (
                    <span>
                      <Tag className="tag-with-margin">{datum}</Tag>{' '}
                    </span>
                  ))
              ) : userData.has_default ? (
                <Alert bsStyle="warning" icon="info-sign">
                  {' '}
                  <FormattedMessage id="user.member-of-def-grp" />
                </Alert>
              ) : (
                <NoData />
              )}
            </PaneItem>
          ))}
          <PaneItem title={intl.formatMessage({ id: 'user.storage-data' })}>
            <Tree data={userData.storage} />
          </PaneItem>
        </Box>
      </SimpleTab>
      <SimpleTab name="settings">
        <UserSettings {...userData.storage.settings} />
      </SimpleTab>
    </SimpleTabs>
  </Flex>
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
  withDispatch(),
  modal(),
  withHandlers({
    onPasswordResetClick: ({
      openModal,
      closeModal,
      userData,
      optimisticDispatch,
    }) => () => {
      const handleSave = async pass => {
        await optimisticDispatch(
          actions.users.update,
          undefined,
          userData.username,
          pass,
          undefined
        );

        closeModal();
      };
      openModal(
        <ResetModal passOnly onSave={handleSave} onClose={closeModal} />
      );
    },
  }),
  withTabs('overview'),
  onlyUpdateForKeys(['userData', 'storage', 'tabQuery']),
  injectIntl
)(UserView);
