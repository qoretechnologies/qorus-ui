// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Link } from 'react-router';
import { Icon } from '@blueprintjs/core';
import { INTERFACE_ICONS } from '../../constants/interfaces';
import Flex from '../Flex';

type InterfaceTagProps = {
  title: string,
  type: string,
  link?: string,
  flex: string,
  className?: string,
};

const InterfaceTag: Function = ({
  title,
  link,
  type,
  className,
  flex: flex = '1 1 auto',
}: InterfaceTagProps): React.Element<any> => (
  <Flex
    flexFlow="row"
    flex={flex}
    className={`interface-tag ${className || ''}`}
  >
    <Icon iconName={INTERFACE_ICONS[type.toLowerCase()]} />
    <Flex flexFlow="row" className="interface-tag-content">
      {link ? (
        <Link
          to={link}
          className="resource-name-link"
          onClick={e => e.stopPropagation()}
        >
          {title}
        </Link>
      ) : (
        title
      )}
    </Flex>
  </Flex>
);

export default compose(
  onlyUpdateForKeys(['title', 'link', 'type', 'className'])
)(InterfaceTag);
