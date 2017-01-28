// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';

import queryControl from '../../../../../hocomponents/queryControl';
import Dropdown, { Item, Control } from '../../../../../components/dropdown';
import { ORDER_STATES } from '../../../../../constants/orders';

type Props = {
  filterQuery: string,
  changeFilterQuery: Function,
  handleFilterChange: Function,
}

const ToolbarFilters: Function = ({
  filterQuery,
  handleFilterChange,
}: Props): React.Element<any> => (
  <Dropdown
    id="filters"
    multi
    def="All"
    onSubmit={handleFilterChange}
    selected={filterQuery ? filterQuery.split(',') : ['All']}
  >
    <Control />
    <Item title="All" />
    {ORDER_STATES.map((o, k) => (
      <Item key={k} title={o.title} />
    ))}
  </Dropdown>
);

export default compose(
  queryControl('filter'),
  withHandlers({
    handleFilterChange: ({
      changeFilterQuery,
    }: Props): Function => (filters: Array<string>): void => {
      changeFilterQuery(filters.join(','));
    },
  }),
  pure([
    'filterQuery',
  ])
)(ToolbarFilters);
