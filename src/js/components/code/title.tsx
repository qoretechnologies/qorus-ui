import { Icon } from '@blueprintjs/core';
import React from 'react';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { normalizeUnknownId } from '../../store/api/resources/utils';
import { normalizeName } from '../utils';

const CodeAreaTitle: Function = ({
  item,
}: {
  item: any;
  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}) => (
  <h5>
    {normalizeName(normalizeUnknownId(item))}{' '}
    {/* @ts-ignore ts-migrate(2339) FIXME: Property 'author' does not exist on type 'Object'. */}
    {item.author && (
      <p className="header-detail">
        {' '}
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'author' does not exist on type 'Object'. */}
        by <Icon icon="user" /> {item.author}
      </p>
    )}
    {/* @ts-ignore ts-migrate(2339) FIXME: Property 'description' does not exist on type 'Obj... Remove this comment to see the full error message */}
    <p className="small">{item.description}</p>
  </h5>
);

export default onlyUpdateForKeys(['item'])(CodeAreaTitle);
