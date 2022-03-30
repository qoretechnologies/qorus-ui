import React from 'react';
import compose from 'recompose/compose';
import upperFirst from 'lodash/upperFirst';
import map from 'lodash/map';

// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Controls as ButtonGroup, Control as Button } from '../controls';
import Dropdown, { Item, Control } from '../dropdown';
import withHandlers from 'recompose/withHandlers';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { injectIntl } from 'react-intl';

type Props = {
  handleSortChange: Function,
  sortData: Object,
  onSortChange: Function,
  sortKeys: Object,
};

const SortingDropdown: Function = ({
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'sortBy' does not exist on type 'Object'.
  sortData: { sortBy, sortByKey },
  handleSortChange,
  sortKeys,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<ButtonGroup> => (
  <ButtonGroup>
    <Button
      icon={
        sortByKey.direction < 0 ? 'sort-alphabetical-desc' : 'sort-alphabetical'
      }
      onClick={(e: any) => handleSortChange(e, sortBy)}
    />
    // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
    <Dropdown key={`${sortBy}_${sortByKey.direction}`}>
      // @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: any; }' is missing the following... Remove this comment to see the full error message
      <Control>{intl.formatMessage({ id: sortBy })}</Control>
      // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
      {map(sortKeys, (column: string, name: string): React.Element<Item> => (
        <Item
          title={name}
          key={column}
          // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
          onClick={e => handleSortChange(e, column)}
        />
      ))}
    </Dropdown>
  </ButtonGroup>
);

export default compose(
  withHandlers({
    handleSortChange: ({ onSortChange }: Props): Function => (
      event: any,
      sortBy: string
    ): void => {
      onSortChange({ sortBy });
    },
  }),
  onlyUpdateForKeys(['sortData', 'sortKeys']),
  injectIntl
)(SortingDropdown);
