// @flow
import { ButtonGroup } from '@blueprintjs/core';
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import Dropdown, { Control, Item } from '../../../../../components/dropdown';
import { ORDER_STATES } from '../../../../../constants/orders';
import queryControl from '../../../../../hocomponents/queryControl';

type Props = {
  filterQuery: string;
  changeFilterQuery: Function;
  handleFilterChange: Function;
  items: Array<Object>;
};

const ToolbarFilters: Function = ({
  filterQuery,
  handleFilterChange,
  items = ORDER_STATES,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props): React.Element<any> => (
  <ButtonGroup>
    <Dropdown
      id="filters"
      multi
      submitOnBlur
      def="All"
      // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
      onSubmit={handleFilterChange}
      selected={filterQuery ? filterQuery.split(',') : ['All']}
    >
      {/* @ts-expect-error ts-migrate(2739) FIXME: Type '{}' is missing the following properties from... Remove this comment to see the full error message */}
      <Control />
      {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
      <Item title="All" />
      {items.map((o, k) => (
        // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
        <Item key={k} title={o.title} />
      ))}
    </Dropdown>
  </ButtonGroup>
);

export default compose(
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('filter'),
  withHandlers({
    handleFilterChange:
      ({ changeFilterQuery }: Props): Function =>
      (filters: Array<string>): void => {
        if (filters[0] === 'All') {
          changeFilterQuery();
        } else {
          changeFilterQuery(filters.join(','));
        }
      },
  }),
  pure(['filterQuery'])
)(ToolbarFilters);
