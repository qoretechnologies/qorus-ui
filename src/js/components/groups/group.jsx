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

const Group: Function = ({ name, size }: Props): React.Element<any> => (
  <Tag intent={Intent.PRIMARY} className="pt-miminal">
    {name} {size}
  </Tag>
);

export default pure(['name', 'size'])(Group);
