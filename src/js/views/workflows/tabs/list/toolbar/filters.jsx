// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';

import queryControl from '../../../../../hocomponents/queryControl';
import Dropdown, { Item, Control } from '../../../../../components/dropdown';
import { ORDER_STATES } from '../../../../../constants/orders';
import { ButtonGroup } from '@blueprintjs/core';

type Props = {
  filterQuery: string,
  changeFilterQuery: Function,
  handleFilterChange: Function,
  items: Array<Object>,
};

const ToolbarFilters: Function = ({
  filterQuery,
  handleFilterChange,
  items: items = ORDER_STATES,
}: Props): React.Element<any> => (
  <ButtonGroup>
    <Dropdown
      id="filters"
      multi
      submitOnBlur
      def="All"
      onSubmit={handleFilterChange}
      selected={filterQuery ? filterQuery.split(',') : ['All']}
    >
      <Control />
      <Item title="All" />
      {items.map((o, k) => (
        <Item key={k} title={o.title} />
      ))}
    </Dropdown>
  </ButtonGroup>
);

export default compose(
  queryControl('filter'),
  withHandlers({
    handleFilterChange: ({ changeFilterQuery }: Props): Function => (
      filters: Array<string>
    ): void => {
      if (filters[0] === 'All') {
        changeFilterQuery();
      } else {
        changeFilterQuery(filters.join(','));
      }
    },
  }),
  pure(['filterQuery'])
)(ToolbarFilters);
