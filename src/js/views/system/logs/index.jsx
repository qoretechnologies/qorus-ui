import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

import LogContainer from '../../../containers/log';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import Tabs, { Pane } from '../../../components/tabs';
import Box from '../../../components/box';
import queryControl from '../../../hocomponents/queryControl';
import titleManager from '../../../hocomponents/TitleManager';

type Props = {
  tabQuery?: string,
  changeTabQuery: Function,
  handleTabChange: Function,
  location: Object,
};

const Log: Function = ({
  handleTabChange,
  tabQuery: tabQuery = 'system',
}: Props) => (
  <div>
    <Breadcrumbs>
      <Crumb>Logs</Crumb>
    </Breadcrumbs>
    <Box top>
      <Tabs
        active={tabQuery}
        id="logs"
        onChange={handleTabChange}
        noContainer
        vertical
      >
        <Pane name="System">
          <LogContainer resource="system" />
        </Pane>
        <Pane name="Http">
          <LogContainer resource="http" />
        </Pane>
        <Pane name="Audit">
          <LogContainer resource="audit" />
        </Pane>
        <Pane name="Alert">
          <LogContainer resource="alert" />
        </Pane>
        <Pane name="Monitor">
          <LogContainer resource="monitor" />
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
  titleManager('Logs')
)(Log);
