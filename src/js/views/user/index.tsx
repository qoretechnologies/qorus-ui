import { Button, ButtonGroup, Intent, Tag } from '@blueprintjs/core';
import { ReqoreControlGroup } from '@qoretechnologies/reqore';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import Flex from '../../components/Flex';
import { SimpleTab, SimpleTabs } from '../../components/SimpleTabs';
import Alert from '../../components/alert';
import Box from '../../components/box';
import { Breadcrumbs, Crumb, CrumbTabs } from '../../components/breadcrumbs';
import NoData from '../../components/nodata';
import PaneItem from '../../components/pane_item';
import Tree from '../../components/tree';
import { normalizeName } from '../../components/utils';
import { INTERFACE_IDS } from '../../constants/interfaces';
import modal from '../../hocomponents/modal';
import withDispatch from '../../hocomponents/withDispatch';
import withTabs from '../../hocomponents/withTabs';
import actions from '../../store/api/actions';
import ResetModal from '../../views/system/rbac/users/modal';
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

const UserView: Function = ({
  userData,
  clearStorage,
  tabQuery,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ userData... Remove this comment to see the full error message
  intl,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'onPasswordResetClick' does not exist on ... Remove this comment to see the full error message
  onPasswordResetClick,
}: {
  userData: any;
  clearStorage: Function;
  tabQuery: string;
}) => (
  <Flex>
    <Breadcrumbs>
      <Crumb>
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'. */}
        {userData.name} <small>({userData.provider})</small>
      </Crumb>
      <CrumbTabs tabs={['Overview', 'Settings']} />
      <ReqoreControlGroup fixed>
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
            // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type '((event... Remove this comment to see the full error message
            onClick={clearStorage}
          />
        </ButtonGroup>
      </ReqoreControlGroup>
    </Breadcrumbs>

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
                  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                  .map((datum: string) => (
                    <span>
                      <Tag className="tag-with-margin">{datum}</Tag>{' '}
                    </span>
                  ))
              ) : // @ts-ignore ts-migrate(2339) FIXME: Property 'has_default' does not exist on type 'Obj... Remove this comment to see the full error message
              userData.has_default ? (
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
            {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
            <Tree data={userData.storage} />
          </PaneItem>
        </Box>
      </SimpleTab>
      <SimpleTab name="settings">
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'storage' does not exist on type 'Object'... Remove this comment to see the full error message */}
        <UserSettings {...userData.storage.settings} />
      </SimpleTab>
    </SimpleTabs>
  </Flex>
);

export default compose(
  connect(
    (state: any) => ({
      // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      storage: state.api.currentUser.data.storage,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      userData: state.api.currentUser.data,
    }),
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
      clearStorage: actions.currentUser.clearStorage,
    }
  ),
  withDispatch(),
  modal(),
  withHandlers({
    onPasswordResetClick:
      ({ openModal, closeModal, userData, optimisticDispatch }) =>
      () => {
        const handleSave = async (pass) => {
          await optimisticDispatch(
            // @ts-ignore ts-migrate(2339) FIXME: Property 'users' does not exist on type '{}'.
            actions.users.update,
            undefined,
            userData.username,
            pass,
            undefined
          );

          closeModal();
        };
        openModal(
          // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
          <ResetModal passOnly onSave={handleSave} onClose={closeModal} />
        );
      },
  }),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
  withTabs('overview'),
  onlyUpdateForKeys(['userData', 'storage', 'tabQuery']),
  injectIntl
)(UserView);
