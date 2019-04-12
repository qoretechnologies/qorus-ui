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
  handleNotificationsCheckboxChange,
  handleNotificationsSoundCheckboxChange,
  soundCheckboxDisabled,
  handleTreeExpandCheckboxChange,
  treeDefaultExpanded,
  handleTreeDataTypesCheckboxChange,
  treeDefaultDataTypes,
}: Props) => (
  <Box fill top scrollY>
    <PaneItem title="Live Notifications">
      <Toolbar mb>
        <Alert bsStyle="info" iconName="notifications">
          When enabled, real time alert notifications display in the
          bottom-right corner of the screen
        </Alert>
      </Toolbar>
      <Checkbox
        label="Enabled"
        onChange={handleNotificationsCheckboxChange}
        checked={notificationsEnabled}
      />
      <Checkbox
        label="Enable sound"
        onChange={handleNotificationsSoundCheckboxChange}
        checked={notificationsSound}
        disabled={soundCheckboxDisabled}
      />
    </PaneItem>
    <PaneItem title="Tree rendering">
      <Checkbox
        label="Always show data types"
        onChange={handleTreeDataTypesCheckboxChange}
        checked={treeDefaultDataTypes}
      />
      <Checkbox
        label="Expanded by default"
        onChange={handleTreeExpandCheckboxChange}
        checked={treeDefaultExpanded}
      />
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
  mapProps(
    ({ notificationsEnabled, ...rest }: Props): Props => ({
      soundCheckboxDisabled: !notificationsEnabled,
      notificationsEnabled,
      ...rest,
    })
  ),
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
  })
)(UserSettings);
