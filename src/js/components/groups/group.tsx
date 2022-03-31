/* @flow */
import { Intent, Tag } from '@blueprintjs/core';
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

type Props = {
  name: string;
  size?: number;
  url?: string;
  disabled?: boolean;
};

// @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const Group: Function = ({ name, size }: Props) => (
  <Tag intent={Intent.PRIMARY} className="bp3-miminal">
    {name} {size}
  </Tag>
);

export default pure(['name', 'size'])(Group);
