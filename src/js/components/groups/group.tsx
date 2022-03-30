/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import { Tag, Intent } from '../../../../node_modules/@blueprintjs/core';

type Props = {
  name: string,
  size?: number,
  url?: string,
  disabled?: boolean,
};

// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const Group: Function = ({ name, size }: Props): React.Element<any> => (
  <Tag intent={Intent.PRIMARY} className="bp3-miminal">
    {name} {size}
  </Tag>
);

export default pure(['name', 'size'])(Group);
