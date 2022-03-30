// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Td, Th } from '../new_table';
import Checkbox from '../checkbox';

type SelectColumnProps = {
  onClick: Function,
  className: string,
  checked: boolean,
};

const SelectColumn: Function = compose(
  onlyUpdateForKeys(['children', 'checked'])
)(
  ({
    onClick,
    checked,
    className = 'tiny',
  // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  }: SelectColumnProps): React.Element<any> => (
    <Td className={className}>
      <Checkbox action={onClick} checked={checked ? 'CHECKED' : 'UNCHECKED'} />
    </Td>
  )
);

type SelectColumnHeaderProps = {
  children: any,
  name: string,
  icon: string,
};

const SelectColumnHeader: Function = compose(
  onlyUpdateForKeys(['children', 'sortData'])
)(
  ({
    name = '_selected',
    icon = 'small-tick',
    ...rest
  // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  }: SelectColumnHeaderProps): React.Element<any> => (
    <Th name={name} icon={icon} {...rest} />
  )
);

export { SelectColumn, SelectColumnHeader };
