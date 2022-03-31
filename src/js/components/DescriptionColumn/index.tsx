// @flow
import React from 'react';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Td, Th } from '../new_table';
import Text from '../text';

type DescriptionColumnProps = {
  children: any;
  className: string;
  expanded?: boolean;
};

const DescriptionColumn: Function = compose(onlyUpdateForKeys(['children', 'expanded']))(
  ({
    children,
    className = 'text',
    expanded,
  }: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  DescriptionColumnProps): React.Element<any> => (
    <Td className={className}>{children ? <Text text={children} expanded={expanded} /> : '-'}</Td>
  )
);

type DescriptionColumnHeaderProps = {
  children: any;
  name: string;
  icon: string;
};

const DescriptionColumnHeader: Function = compose(
  onlyUpdateForKeys(['children', 'sortData']),
  injectIntl
)(
  ({
    children,
    name = 'desc',
    icon = 'label',
    // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Descriptio... Remove this comment to see the full error message
    intl,
    ...rest
  }: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  DescriptionColumnHeaderProps): React.Element<any> => (
    <Th name={name} icon={icon} className="text" {...rest}>
      {children || intl.formatMessage({ id: 'table.description' })}
    </Th>
  )
);

export { DescriptionColumn, DescriptionColumnHeader };
