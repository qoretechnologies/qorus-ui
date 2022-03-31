// @flow
import { MenuDivider } from '@blueprintjs/core';
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

type DropdownDividerProps = {
  title: string;
  className?: string;
};

const DropdownDivider: Function = ({
  title,
  className,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
DropdownDividerProps): React.Element<any> => <MenuDivider title={title} className={className} />;

export default compose(onlyUpdateForKeys(['title', 'className']))(DropdownDivider);
