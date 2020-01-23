import React from 'react';

import PaneItem from '../../../components/pane_item';
import Toolbar from '../../../components/toolbar';
import { Checkbox } from '@blueprintjs/core';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import actions from '../../../store/api/actions';
import mapProps from 'recompose/mapProps';
import Alert from '../../../components/alert';
import Box from '../../../components/box';
import { Modules } from '../../../constants/settings';
import { map } from 'lodash';
import { injectIntl, FormattedMessage } from 'react-intl';

type Props = {
  storage: Object,
  notificationsEnabled: boolean,
  notificationsSound: boolean,
  soundCheckboxDisabled: boolean,
  handleNotificationsCheckboxChange: Function,
  handleNotificationsSoundCheckboxChange: Function,
};

const UserSettings: Function = ({
  notificationsSound,
  notificationsEnabled,
  notificationsBrowser,
  handleNotificationsCheckboxChange,
  handleNotificationsSoundCheckboxChange,
  soundCheckboxDisabled,
  handleTreeExpandCheckboxChange,
  treeDefaultExpanded,
  handleTreeDataTypesCheckboxChange,
  treeDefaultDataTypes,
  handleNotificationsBrowserChange,
  dashboardModules,
  handleDashboardModulesChange,
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
        onChange={handleNotificationsCheckboxChange}
        checked={notificationsEnabled}
      />
      <Checkbox
        label={intl.formatMessage({ id: 'settings.enable-sound' })}
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
            handleDashboardModulesChange(
              dModule,
              !dashboardModules.includes(dModule)
            );
          }}
        />
      ))}
    </PaneItem>
  </Box>
);

export default compose(
  connect(
    null,
    {
      storeSettings: actions.currentUser.storeSettings,
    }
  ),
  mapProps(({ notificationsEnabled, ...rest }: Props): Props => ({
    soundCheckboxDisabled: !notificationsEnabled,
    notificationsEnabled,
    ...rest,
  })),
  withHandlers({
    handleNotificationsCheckboxChange: ({
      storeSettings,
      notificationsEnabled,
    }: Props): Function => (): void => {
      storeSettings('notificationsEnabled', !notificationsEnabled);
    },
    handleNotificationsSoundCheckboxChange: ({
      storeSettings,
      notificationsSound,
    }: Props): Function => (): void => {
      storeSettings('notificationsSound', !notificationsSound);
    },
    handleNotificationsBrowserChange: ({
      storeSettings,
      notificationsBrowser,
    }) => () => {
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
            Notification.requestPermission().then(permission => {
              if (permission === 'granted') {
                storeSettings('notificationsBrowser', true);
              }
            });
          }
        }
      }
    },
    handleTreeExpandCheckboxChange: ({
      storeSettings,
      treeDefaultExpanded,
    }) => (): void => {
      storeSettings('treeDefaultExpanded', !treeDefaultExpanded);
    },
    handleTreeDataTypesCheckboxChange: ({
      storeSettings,
      treeDefaultDataTypes,
    }) => (): void => {
      storeSettings('treeDefaultDataTypes', !treeDefaultDataTypes);
    },
    handleDashboardModulesChange: ({ storeSettings, dashboardModules }) => (
      module: string,
      value: boolean
    ): void => {
      let newDashboardModules;

      if (value) {
        // Add the module
        newDashboardModules = [...dashboardModules, module];
      } else {
        // Remove the module
        newDashboardModules = dashboardModules.filter(mod => mod !== module);
      }

      storeSettings('dashboardModules', newDashboardModules);
    },
  }),
  injectIntl
)(UserSettings);
