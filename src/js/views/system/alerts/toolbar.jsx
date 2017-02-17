// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import Search from '../../../components/search';
import Toolbar from '../../../components/toolbar';
import queryControl from '../../../hocomponents/queryControl';

type Props = {
  searchQuery: string,
  changeSearchQuery: Function,
};

const AlertsToolbar: Function = ({
  searchQuery,
  changeSearchQuery,
}: Props): React.Element<any> => (
  <Toolbar>
    <Search
      defaultValue={searchQuery}
      onSearchUpdate={changeSearchQuery}
    />
  </Toolbar>
);

export default compose(
  queryControl('search'),
  pure(['searchQuery'])
)(AlertsToolbar);
