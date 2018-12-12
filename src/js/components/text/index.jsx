// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import Flex from '../Flex';
import Tree from '../tree';

type Props = {
  text: any,
};

const Text: Function = ({ text }: Props): React.Element<any> =>
  text && typeof text === 'object' ? (
    <Tree data={text} />
  ) : (
    <Flex flexFlow="row">
      <div className="text-component" title={text}>
        {text}
      </div>
    </Flex>
  );

export default compose(pure(['text']))(Text);
