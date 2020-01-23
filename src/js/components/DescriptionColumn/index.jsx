// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Td, Th } from '../new_table';
import Text from '../text';
import { injectIntl } from 'react-intl';

type DescriptionColumnProps = {
  children: any,
  className: string,
  expanded?: boolean,
};

const DescriptionColumn: Function = compose(
  onlyUpdateForKeys(['children', 'expanded'])
)(
  ({
    children,
    className: className = 'text',
    expanded,
  }: DescriptionColumnProps): React.Element<any> => (
    <Td className={className}>
      {children ? <Text text={children} expanded={expanded} /> : '-'}
    </Td>
  )
);

type DescriptionColumnHeaderProps = {
  children: any,
  name: string,
  icon: string,
};

const DescriptionColumnHeader: Function = compose(
  onlyUpdateForKeys(['children', 'sortData']),
  injectIntl
)(
  ({
    children,
    name: name = 'desc',
    icon: icon = 'label',
    intl,
    ...rest
  }: DescriptionColumnHeaderProps): React.Element<any> => (
    <Th name={name} icon={icon} className="text" {...rest}>
      {children || intl.formatMessage({ id: 'table.description' })}
    </Th>
  )
);

export { DescriptionColumn, DescriptionColumnHeader };
