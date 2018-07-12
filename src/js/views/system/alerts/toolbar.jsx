// @flow
import React from 'react';
import compose from 'recompose/compose';
import capitalize from 'lodash/capitalize';

import Search from '../../../containers/search';
import Toolbar from '../../../components/toolbar';
import queryControl from '../../../hocomponents/queryControl';

type Props = {
  type: string,
  searchQuery: string,
  changeSearchQuery: Function,
};

const AlertsToolbar: Function = ({
  type,
  ...rest
}: Props): React.Element<any> => (
  <Toolbar mt>
    <Search
      defaultValue={rest[`${type}SearchQuery`]}
      onSearchUpdate={rest[`change${capitalize(type)}searchQuery`]}
      resource="alerts"
    />
  </Toolbar>
);

export default compose(queryControl(({ type }) => `${type}Search`))(
  AlertsToolbar
);
