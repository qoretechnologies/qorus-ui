import React from 'react';
import compose from 'recompose/compose';
import upperFirst from 'lodash/upperFirst';
import map from 'lodash/map';

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
  sortData: { sortBy, sortByKey },
  handleSortChange,
  sortKeys,
  intl,
}: Props): React.Element<ButtonGroup> => (
  <ButtonGroup>
    <Button
      icon={
        sortByKey.direction < 0 ? 'sort-alphabetical-desc' : 'sort-alphabetical'
      }
      onClick={(e: any) => handleSortChange(e, sortBy)}
    />
    <Dropdown key={`${sortBy}_${sortByKey.direction}`}>
      <Control>{intl.formatMessage({ id: sortBy })}</Control>
      {map(sortKeys, (column: string, name: string): React.Element<Item> => (
        <Item
          title={name}
          key={column}
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
