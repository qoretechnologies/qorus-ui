import React from 'react';
import { normalizeName } from '../utils';
import { normalizeUnknownId } from '../../store/api/resources/utils';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Icon } from '@blueprintjs/core';

const CodeAreaTitle: Function = ({
  item,
}: {
  item: Object,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}): React.Element<HTMLHeadingElement> => (
  <h5>
    {normalizeName(normalizeUnknownId(item))}{' '}
    { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'author' does not exist on type 'Object'. */ }
    {item.author && (
      <p className="header-detail">
        {' '}
        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'author' does not exist on type 'Object'. */ }
        by <Icon icon="user" /> {item.author}
      </p>
    )}
    { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'description' does not exist on type 'Obj... Remove this comment to see the full error message */ }
    <p className="small">{item.description}</p>
  </h5>
);

export default onlyUpdateForKeys(['item'])(CodeAreaTitle);
