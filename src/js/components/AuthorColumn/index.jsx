// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Td, Th } from '../new_table';
import Text from '../text';

type AuthorColumnProps = {
  children: any,
  className: string,
};

const AuthorColumn: Function = compose(onlyUpdateForKeys(['children']))(
  ({
    children,
    className: className = 'text',
  }: AuthorColumnProps): React.Element<any> => (
    <Td className={className}>
      <Text text={children || '-'} />
    </Td>
  )
);

type AuthorColumnHeaderProps = {
  children: any,
  name: string,
  icon: string,
};

const AuthorColumnHeader: Function = compose(
  onlyUpdateForKeys(['children', 'sortData'])
)(
  ({
    children: children = 'Author',
    name: name = 'author',
    icon: icon = 'person',
    ...rest
  }: AuthorColumnHeaderProps): React.Element<any> => (
    <Th iconName={icon} name={name} className="text" {...rest}>
      {children}
    </Th>
  )
);

export { AuthorColumn, AuthorColumnHeader };
