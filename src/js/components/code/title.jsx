import React from 'react';
import { normalizeName } from '../utils';
import { normalizeUnknownId } from '../../store/api/resources/utils';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Icon } from '@blueprintjs/core';

const CodeAreaTitle: Function = ({
  item,
}: {
  item: Object,
}): React.Element<HTMLHeadingElement> => (
  <h5>
    {normalizeName(normalizeUnknownId(item))}{' '}
    {item.author && (
      <p className="header-detail">
        {' '}
        by <Icon iconName="user" /> {item.author}
      </p>
    )}
    <p className="small">{item.description}</p>
  </h5>
);

export default onlyUpdateForKeys(['item'])(CodeAreaTitle);
