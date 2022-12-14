// @flow
import { Icon } from '@blueprintjs/core';
import React from 'react';
import { Link } from 'react-router';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { INTERFACE_ICONS } from '../../constants/interfaces';
import Flex from '../Flex';

type InterfaceTagProps = {
  title: string;
  type: string;
  link?: string;
  flex: string;
  className?: string;
};

const InterfaceTag: Function = ({
  title,
  link,
  type,
  className,
  flex = '1 1 auto',
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
InterfaceTagProps) => (
  <Flex flexFlow="row" flex={flex} className={`interface-tag ${className || ''}`} title={title}>
    <Icon iconSize={12} icon={INTERFACE_ICONS[type.toLowerCase()]} />
    <Flex flexFlow="row" className="interface-tag-content">
      {link ? (
        <Link to={link} className="resource-name-link" onClick={(e) => e.stopPropagation()}>
          {title}
        </Link>
      ) : (
        title
      )}
    </Flex>
  </Flex>
);

export default compose(onlyUpdateForKeys(['title', 'link', 'type', 'className']))(InterfaceTag);
