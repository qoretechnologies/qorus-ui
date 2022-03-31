import map from 'lodash/map';
import React from 'react';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control as Button, Controls as ButtonGroup } from '../controls';
import Dropdown, { Control, Item } from '../dropdown';

type Props = {
  handleSortChange: Function;
  sortData: any;
  onSortChange: Function;
  sortKeys: any;
};

const SortingDropdown: Function = ({
  // @ts-ignore ts-migrate(2339) FIXME: Property 'sortBy' does not exist on type 'Object'.
  sortData: { sortBy, sortByKey },
  handleSortChange,
  sortKeys,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <ButtonGroup>
    <Button
      icon={sortByKey.direction < 0 ? 'sort-alphabetical-desc' : 'sort-alphabetical'}
      onClick={(e: any) => handleSortChange(e, sortBy)}
    />
    {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
    <Dropdown key={`${sortBy}_${sortByKey.direction}`}>
      {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ children: any; }' is missing the following... Remove this comment to see the full error message */}
      <Control>{intl.formatMessage({ id: sortBy })}</Control>
      {/* @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message */}
      {map(sortKeys, (column: string, name: string) => (
        <Item
          title={name}
          key={column}
          // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
          onClick={(e) => handleSortChange(e, column)}
        />
      ))}
    </Dropdown>
  </ButtonGroup>
);

export default compose(
  withHandlers({
    handleSortChange:
      ({ onSortChange }: Props): Function =>
      (event: any, sortBy: string): void => {
        onSortChange({ sortBy });
      },
  }),
  onlyUpdateForKeys(['sortData', 'sortKeys']),
  injectIntl
)(SortingDropdown);
