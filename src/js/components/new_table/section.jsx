/* @flow */
import React from 'react';
import mapProps from 'recompose/mapProps';
import updateOnlyForKeys from 'recompose/onlyUpdateForKeys';

type Props = {
  type: string,
  children: any,
}

let Section: Function = ({ type: Tag, children }: Props): React.Element<any> => {
  if (Tag === 'thead') {
    return (
      <Tag>
        { React.cloneElement(children, { fixed: true })}
        { children }
      </Tag>
    );
  }

  return (
    <Tag>
      { children }
    </Tag>
  );
};

Section = updateOnlyForKeys([
  'children',
])(Section);

const Thead = mapProps((props: Object) => ({ ...props, type: 'thead' }))(Section);
const Tbody = mapProps((props: Object) => ({ ...props, type: 'tbody' }))(Section);
const Tfooter = mapProps((props: Object) => ({ ...props, type: 'tfoot' }))(Section);

export {
  Thead,
  Tbody,
  Tfooter,
};
