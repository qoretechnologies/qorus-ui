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
    className: className = 'tiny',
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
    name: name = '_selected',
    icon: icon = 'small-tick',
    ...rest
  }: SelectColumnHeaderProps): React.Element<any> => (
    <Th name={name} iconName={icon} {...rest} />
  )
);

export { SelectColumn, SelectColumnHeader };
