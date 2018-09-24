// @flow
import React from 'react';
import capitalize from 'lodash/capitalize';

import Orders from './orders';
import Errors from './errors';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';
import Tabs, { Pane } from '../../components/tabs';
import Box from '../../components/box';
import withTabs from '../../hocomponents/withTabs';
import compose from 'recompose/compose';
import titleManager from '../../hocomponents/TitleManager';

type Props = {
  location: Object,
  tabQuery: string,
  handleTabChange: Function,
};

const Search: Function = ({
  location,
  tabQuery,
  handleTabChange,
}: Props): React.Element<any> => (
  <div>
    <Breadcrumbs>
      <Crumb>Search</Crumb>
      <Crumb>{capitalize(tabQuery)}</Crumb>
    </Breadcrumbs>
    <Box top>
      <Tabs
        active={tabQuery}
        id="search"
        onChange={handleTabChange}
        noContainer
      >
        <Pane name="Orders">
          <Orders location={location} />
        </Pane>
        <Pane name="Errors">
          <Errors location={location} />
        </Pane>
      </Tabs>
    </Box>
  </div>
);

export default compose(
  withTabs('orders'),
  titleManager('Search')
)(Search);
