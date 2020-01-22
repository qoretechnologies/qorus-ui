// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Td, Th } from '../new_table';
import Text from '../text';
import { injectIntl } from 'react-intl';

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
  onlyUpdateForKeys(['children', 'sortData']),
  injectIntl
)(
  ({
    children,
    name: name = 'author',
    icon: icon = 'person',
    intl,
    ...rest
  }: AuthorColumnHeaderProps): React.Element<any> => (
    <Th icon={icon} name={name} className="text" {...rest}>
      {children || intl.formatMessage({ id: 'table.author' })}
    </Th>
  )
);

export { AuthorColumn, AuthorColumnHeader };
