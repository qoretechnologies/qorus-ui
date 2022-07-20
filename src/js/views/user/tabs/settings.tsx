import { Checkbox } from '@blueprintjs/core';
import { map } from 'lodash';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';
import Alert from '../../../components/alert';
import Box from '../../../components/box';
import PaneItem from '../../../components/pane_item';
import Toolbar from '../../../components/toolbar';
import { Modules } from '../../../constants/settings';
import actions from '../../../store/api/actions';

type Props = {
  storage: any;
  notificationsEnabled: boolean;
  notificationsSound: boolean;
  soundCheckboxDisabled: boolean;
  handleNotificationsCheckboxChange: Function;
  handleNotificationsSoundCheckboxChange: Function;
};

const UserSettings: Function = ({
  notificationsSound,
  notificationsEnabled,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'notificationsBrowser' does not exist on ... Remove this comment to see the full error message
  notificationsBrowser,
  handleNotificationsCheckboxChange,
  handleNotificationsSoundCheckboxChange,
  soundCheckboxDisabled,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'handleTreeExpandCheckboxChange' does not... Remove this comment to see the full error message
  handleTreeExpandCheckboxChange,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'treeDefaultExpanded' does not exist on t... Remove this comment to see the full error message
  treeDefaultExpanded,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'handleTreeDataTypesCheckboxChange' does ... Remove this comment to see the full error message
  handleTreeDataTypesCheckboxChange,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'treeDefaultDataTypes' does not exist on ... Remove this comment to see the full error message
  treeDefaultDataTypes,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'handleNotificationsBrowserChange' does n... Remove this comment to see the full error message
  handleNotificationsBrowserChange,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'dashboardModules' does not exist on type... Remove this comment to see the full error message
  dashboardModules,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'handleDashboardModulesChange' does not e... Remove this comment to see the full error message
  handleDashboardModulesChange,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: Props) => (
  <Box fill top scrollY>
    <PaneItem title={intl.formatMessage({ id: 'settings.live-notifs' })}>
      <Toolbar mb>
        <Alert bsStyle="info" icon="notifications">
          <FormattedMessage id="settings.when-enabled" />
        </Alert>
      </Toolbar>
      <Checkbox
        label={intl.formatMessage({ id: 'settings.enabled' })}
        // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
        onChange={handleNotificationsCheckboxChange}
        checked={notificationsEnabled}
      />
      <Checkbox
        label={intl.formatMessage({ id: 'settings.enable-sound' })}
        // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
        onChange={handleNotificationsSoundCheckboxChange}
        checked={notificationsSound}
        disabled={soundCheckboxDisabled}
      />
      <PaneItem title={intl.formatMessage({ id: 'settings.browser-notifs' })}>
        <Checkbox
          label={intl.formatMessage({ id: 'settings.enable-browser-notifs' })}
          onChange={handleNotificationsBrowserChange}
          checked={notificationsBrowser}
        />
      </PaneItem>
    </PaneItem>
    <PaneItem title={intl.formatMessage({ id: 'settings.tree-rendering' })}>
      <Checkbox
        label={intl.formatMessage({ id: 'settings.always-show-data-types' })}
        onChange={handleTreeDataTypesCheckboxChange}
        checked={treeDefaultDataTypes}
      />
      <Checkbox
        label={intl.formatMessage({ id: 'settings.expanded-by-def' })}
        onChange={handleTreeExpandCheckboxChange}
        checked={treeDefaultExpanded}
      />
    </PaneItem>
    <PaneItem title={intl.formatMessage({ id: 'Dashboard' })} id="dashboard">
      <Alert bsStyle="info" icon="notifications">
        <FormattedMessage id="settings.below-you-can-select" />
      </Alert>
      {map(Modules, (dModule, name) => (
        <Checkbox
          label={intl.formatMessage({ id: name })}
          checked={dashboardModules.includes(dModule)}
          onChange={() => {
            handleDashboardModulesChange(dModule, !dashboardModules.includes(dModule));
          }}
        />
      ))}
    </PaneItem>
  </Box>
);

export default compose(
  connect(null, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
    storeSettings: actions.currentUser.storeSettings,
  }),
  mapProps(
    ({ notificationsEnabled, ...rest }: Props): Props => ({
      soundCheckboxDisabled: !notificationsEnabled,
      notificationsEnabled,
      ...rest,
    })
  ),
  withHandlers({
    handleNotificationsCheckboxChange:
      ({
        // @ts-ignore ts-migrate(2339) FIXME: Property 'storeSettings' does not exist on type 'P... Remove this comment to see the full error message
        storeSettings,
        notificationsEnabled,
      }: Props): Function =>
      (): void => {
        storeSettings('notificationsEnabled', !notificationsEnabled);
      },
    handleNotificationsSoundCheckboxChange:
      ({
        // @ts-ignore ts-migrate(2339) FIXME: Property 'storeSettings' does not exist on type 'P... Remove this comment to see the full error message
        storeSettings,
        notificationsSound,
      }: Props): Function =>
      (): void => {
        storeSettings('notificationsSound', !notificationsSound);
      },
    handleNotificationsBrowserChange:
      ({ storeSettings, notificationsBrowser }) =>
      () => {
        // If the notifications are turned on
        if (notificationsBrowser) {
          // Turn them off
          storeSettings('notificationsBrowser', false);
        } else {
          // Ask the user for notification permisisons
          if ('Notification' in window) {
            // Check if user already granted the notifications
            if (Notification.permission === 'granted') {
              // Turn them on
              storeSettings('notificationsBrowser', true);
            } else if (Notification.permission === 'default') {
              // Ask the user for notifications
              // access
              Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                  storeSettings('notificationsBrowser', true);
                }
              });
            }
          }
        }
      },
    handleTreeExpandCheckboxChange:
      ({ storeSettings, treeDefaultExpanded }) =>
      (): void => {
        storeSettings('treeDefaultExpanded', !treeDefaultExpanded);
      },
    handleTreeDataTypesCheckboxChange:
      ({ storeSettings, treeDefaultDataTypes }) =>
      (): void => {
        storeSettings('treeDefaultDataTypes', !treeDefaultDataTypes);
      },
    handleDashboardModulesChange:
      ({ storeSettings, dashboardModules }) =>
      (module: string, value: boolean): void => {
        let newDashboardModules;

        if (value) {
          // Add the module
          newDashboardModules = [...dashboardModules, module];
        } else {
          // Remove the module
          newDashboardModules = dashboardModules.filter((mod) => mod !== module);
        }

        storeSettings('dashboardModules', newDashboardModules);
      },
  }),
  injectIntl
)(UserSettings);
