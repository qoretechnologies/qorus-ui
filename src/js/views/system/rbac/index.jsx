/* @flow */
import React from 'react';
import compose from 'recompose/compose';

import Tabs, { Pane } from '../../../components/tabs';
import Users from './users';
import Roles from './roles';
import Permissions from './permissions';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import Box from '../../../components/box';
import queryControl from '../../../hocomponents/queryControl';
import withHandlers from 'recompose/withHandlers';
import titleManager from '../../../hocomponents/TitleManager';

type Props = {
  tabQuery?: string,
  changeTabQuery: Function,
  handleTabChange: Function,
  location: Object,
};

const RBAC: Function = ({
  tabQuery: tabQuery = 'users',
  handleTabChange,
  location,
}: Props): React.Element<any> => (
  <div>
    <Breadcrumbs>
      <Crumb>RBAC</Crumb>
    </Breadcrumbs>
    <Box top>
      <Tabs
        active={tabQuery}
        id="rbac"
        onChange={handleTabChange}
        noContainer
        vertical
      >
        <Pane name="Users">
          <Users location={location} />
        </Pane>
        <Pane name="Roles">
          <Roles location={location} />
        </Pane>
        <Pane name="Permissions">
          <Permissions location={location} />
        </Pane>
      </Tabs>
    </Box>
  </div>
);

export default compose(
  queryControl('tab'),
  withHandlers({
    handleTabChange: ({ changeTabQuery }: Props): Function => (
      tabId: string
    ): void => {
      changeTabQuery(tabId);
    },
  }),
  titleManager('RBAC')
)(RBAC);
